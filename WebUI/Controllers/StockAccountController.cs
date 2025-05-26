using Entities.Concrete;
using Entities.DTOs;
using Microsoft.AspNetCore.Mvc;
using WebUI.Models;
using WebUI.Services;

namespace WebUI.Controllers
{
    public class StockAccountController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly TokenService _tokenService;
        private readonly BusinessService _businessService;

        public StockAccountController(TokenService tokenService, HttpClient httpClient, BusinessService businessService)
        {
            _tokenService = tokenService;
            _httpClient = httpClient;
            _businessService = businessService;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult StockAccount()
        {
            var model = new StockAccountViewModel();
            model.AccountList = _businessService.GetAll<StockAccount>(ApiURL.StockAccountGetAll).Result;
            model.BankList = _businessService.GetAll<BankAndExchange>(ApiURL.BankAndExchangeGetAll).Result;
            model.AccountDetails = _businessService.GetByUserId<StockAccountDetailDto>(ApiURL.GetStockAccountDetailByUserId).Result;
            return View(model);
        }

        public async Task<IActionResult> Add(StockAccountViewModel model)
        {
            model.MyAccount.CreatedAt = DateTime.UtcNow;
            model.MyAccount.UpdatedAt = DateTime.UtcNow;
            model.MyAccount.UserId = _tokenService.GetTokenInfo();
            model.MyAccount.Currency = "TRY";
            await _businessService.PostAsync(model.MyAccount, ApiURL.StockAccountAdd);
            return RedirectToAction("StockAccount");
        }
        public async Task<IActionResult> Update(StockAccountViewModel model)
        {
            var account = _businessService.GetAll<StockAccount>(ApiURL.StockAccountGetAll).Result.Data?.Where(d => d.Id == model.MyAccount?.Id).FirstOrDefault();
            account.Balance = model.MyAccount.Balance;
            account.AccountNo = model.MyAccount.AccountNo;
            account.ExchangeId = model.MyAccount.ExchangeId;
            account.UpdatedAt = DateTime.UtcNow;
            account.CreatedAt = DateTime.UtcNow;
            await _businessService.PostAsync(account, ApiURL.StockAccountUpdate);
            return RedirectToAction("StockAccount");
        }
        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var account = _businessService.GetAll<StockAccount>(ApiURL.StockAccountGetAll).Result.Data?.Where(d => d.Id == id).FirstOrDefault();
            await _businessService.PostAsync(account, ApiURL.StockAccountDelete);
            return RedirectToAction("StockAccount");
        }

    }
}
