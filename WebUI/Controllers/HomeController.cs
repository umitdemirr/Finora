using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebUI.Models;
using WebUI.Services;

namespace WebUI.Controllers
{
    public class HomeController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly TokenService _tokenService;
        private readonly BusinessService _businessService;

        public HomeController(TokenService tokenService, HttpClient httpClient, BusinessService businessService)
        {
            _tokenService = tokenService;
            _httpClient = httpClient;
            _businessService = businessService;
        }

        public IActionResult Index(int range)
        {
            if (string.IsNullOrEmpty(Request.Cookies["FinoraAccessToken"]))
                return RedirectToAction("Login", "Auth");

            var model = new HomeViewModel();
            model.BankAccountDetail = _businessService.GetAll<BankAccountDetailDto>(ApiURL.GetBankAccountDetail).Result;
            model.BankTransactions = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result;
            model.Varliklarim = _businessService.GetAll<Entities.Concrete.Asset>(ApiURL.AssetGetAll).Result;

            model.TotalMoney += model.BankAccountDetail.Data.Sum(account => account.Balance);
            model.TotalExpanse = model.BankTransactions.Data.Where(t => t.TransactionType == "Gider").Sum(t => t.Amount);
            model.TotalIncome = model.BankTransactions.Data.Where(t => t.TransactionType == "Gelir").Sum(t => t.Amount);
            model.NetWorth = model.TotalIncome - model.TotalExpanse;

            var groupedData = model.BankTransactions.Data
                .Where(t => t.TransactionType == "Gider" || t.TransactionType == "Debit")
                .GroupBy(x => x.Category)
                .Select(g => new{Category = g.Key,TotalAmount = g.Sum(x => x.Amount)})
                .ToList();

            var totalAmount = groupedData.Sum(x => x.TotalAmount);
            var categoryRatios = groupedData
                .Select(x => new CategoryRatioDto{Category = x.Category,TotalAmount = x.TotalAmount,Percentage = totalAmount > 0 ? Math.Round((double)(x.TotalAmount / totalAmount * 100), 2) : 0})
                .ToList();

            model.Harcamalar = categoryRatios;


            List<AssetRatioDto> GetDistribution(string type)
            {
                var filtered = model.Varliklarim.Data
                    .Where(x => x.AssetType == type)
                    .GroupBy(x => x.Sembol)
                    .Select(g => new
                    {
                        Symbol = g.Key,
                        Total = g.Sum(x => x.AlisToplam)
                    })
                    .ToList();

                var total = filtered.Sum(x => x.Total);

                return filtered.Select(x => new AssetRatioDto
                {
                    Symbol = x.Symbol,
                    TotalValue = x.Total,
                    Percentage = total > 0 ? Math.Round((double)(x.Total / total * 100), 2) : 0
                }).ToList();
            }
            model.StockDagilimi = GetDistribution("STOCK");
            model.CryptoDagilimi = GetDistribution("CRYPTO");
            model.EmtiaDagilimi = GetDistribution("EMTIA");



            var today = DateTime.Today;
            var dateRanges = new Dictionary<int, Func<DateTime>>
            {
                { 1, () => today.AddDays(-1) },
                { 7, () => today.AddDays(-7) },
                { 30, () => today.AddMonths(-1) },
                { 180, () => today.AddMonths(-6) },
                { 365, () => today.AddYears(-1) }
            };

            DateTime startDate = dateRanges.ContainsKey(range) ? dateRanges[range]() : today.AddYears(-1);
            var filteredTransactions = model.BankTransactions.Data.Where(t => t.Date >= startDate).GroupBy(t => t.Date.Date).OrderBy(g => g.Key).ToList();
            foreach (var day in filteredTransactions)
            {
                model.Labels.Add(day.Key.ToString("dd MMM"));
                model.Gelirler.Add(day.Where(x => x.TransactionType == "Gelir").Sum(x => x.Amount));
                model.Giderler.Add(day.Where(x => x.TransactionType == "Gider").Sum(x => x.Amount));
            }
            return View(model);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


    }
}
