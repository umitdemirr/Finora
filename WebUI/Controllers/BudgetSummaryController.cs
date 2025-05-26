using Microsoft.AspNetCore.Mvc;
using WebUI.Models;
using WebUI.Models.Entities;
using WebUI.Services;

namespace WebUI.Controllers
{
    public class BudgetSummaryController : Controller
    {
        private readonly TokenService _tokenService;
        private readonly BusinessService _businessService;

        public BudgetSummaryController(TokenService tokenService, BusinessService businessService)
        {
            _tokenService = tokenService;
            _businessService = businessService;
        }


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Income()
        {
            var model = new SummaryViewModel();
            var result = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result;
            model.BankTransactionList = result;
            model.BankTransactionList.Data = result?.Data?.Where(i => i.TransactionType == "Gelir").ToList();

            var gelirListesi = result?.Data?.Where(i => i.TransactionType == "Gelir").ToList();
            if (gelirListesi != null && gelirListesi.Any())
            {
                model.ToplamGelir = gelirListesi.Sum(i => i.Amount);
                model.EnYuksekGelir = gelirListesi.Max(i => i.Amount);
                model.GelirSayisi = gelirListesi.Count;
                var aylikGruplar = gelirListesi.GroupBy(i => new { i.Date.Year, i.Date.Month }).Select(g => new{Ay = g.Key,Toplam = g.Sum(x => x.Amount)});
                model.AylıkOrtalamaGelir = aylikGruplar.Average(g => g.Toplam);
            }
            else
            {
                model.ToplamGelir = 0;
                model.EnYuksekGelir = 0;
                model.GelirSayisi = 0;
                model.AylıkOrtalamaGelir = 0;
            }

            return View(model);
        }
        public IActionResult Expense()
        {
            var model = new SummaryViewModel();
            var result = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result;
            model.BankTransactionList = result;
            model.BankTransactionList.Data = result?.Data?.Where(i => i.TransactionType == "Gider").ToList();

            var giderListesi = result?.Data?
    .Where(i => i.TransactionType == "Gider")
    .ToList();

            if (giderListesi != null && giderListesi.Any())
            {
                model.ToplamGider = giderListesi.Sum(i => i.Amount);
                model.EnYüksekGider = giderListesi.Max(i => i.Amount);
                model.GiderSayisi = giderListesi.Count;
                var aylikGiderGruplar = giderListesi
                    .GroupBy(i => new { i.Date.Year, i.Date.Month })
                    .Select(g => new
                    {
                        Ay = g.Key,
                        Toplam = g.Sum(x => x.Amount)
                    });

                model.AylıkOrtalamaGider = aylikGiderGruplar.Average(g => g.Toplam);
            }
            else
            {
                model.ToplamGider = 0;
                model.EnYüksekGider = 0;
                model.GiderSayisi = 0;
                model.AylıkOrtalamaGider = 0;
            }

            return View(model);
        }
        public IActionResult Debts()
        {
            var model = new SummaryViewModel();
            model.BankTransactionList = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result;
            model.BankTransactionList.Data = model.BankTransactionList?.Data?.Where(i => i.TransactionType == "Debit").ToList();

            model.MyCreditCards = _businessService.GetByUserId<CreditCardDetailDto>(ApiURL.GetAllCreditCardDetailByUserId).Result;
            model.ToplamBorcum = model.MyCreditCards.Data.Sum(b=>b.Limit) - model.MyCreditCards.Data.Sum(b => b.AvaliableLimit);
            model.AsgariOdeme = Math.Round(model.ToplamBorcum * 0.25m, 2);


            return View(model);
        }

    }
}
