using Microsoft.AspNetCore.Mvc;
using WebUI.Models;
using WebUI.Models.Entities;
using WebUI.Services;

namespace WebUI.Controllers
{
    public class BankTransactionController : Controller
    {
        private readonly TokenService _tokenService;
        private readonly BusinessService _businessService;

        public BankTransactionController(TokenService tokenService, HttpClient httpClient, BusinessService businessService)
        {
            _tokenService = tokenService;
            _businessService = businessService;
        }

        public async Task<IActionResult> Index()
        {
            var model = new BankTransactionViewModel();

            model.BankTransactionList = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result;
            model.BankAccountList = await _businessService.GetFiltered<BankAccount>(ApiURL.BankAccountGetAll, u=>u.UserId == _tokenService.GetTokenInfo());
            model.BankList = await _businessService.GetAll<BankAndExchange>(ApiURL.BankAndExchangeGetAll);
            model.BankCardList = await _businessService.GetAll<Card>(ApiURL.BankCardGetAll);
            model.CreditCardList = await _businessService.GetAll<Card>(ApiURL.CreditCardGetAll);
            return View(model);
        }

        public async Task<IActionResult> GetAddTransactionModal()
        {
            var model = new BankTransactionViewModel();

            model.BankTransactionList = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result;
            model.BankAccountList = await _businessService.GetFiltered<BankAccount>(ApiURL.BankAccountGetAll, u => u.UserId == _tokenService.GetTokenInfo());
            model.BankList = await _businessService.GetAll<BankAndExchange>(ApiURL.BankAndExchangeGetAll);
            model.BankCardList = await _businessService.GetAll<Card>(ApiURL.BankCardGetAll);
            model.CreditCardList = await _businessService.GetAll<Card>(ApiURL.CreditCardGetAll);
            return PartialView("_AddTransactionModal", model);

        }

        [HttpPost]
        public async Task<IActionResult> Add(BankTransactionViewModel model)
        {
            model.BankTransaction.Date = DateTime.UtcNow;
            model.BankTransaction.Currency = "TRY";
            await _businessService.PostAsync(model.BankTransaction, ApiURL.BankTransactionAdd);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Update(BankTransactionViewModel model)
        {
            var transaction = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result.Data?.Where(t=>t.Id == model.BankTransaction?.Id).FirstOrDefault();
            transaction.Date = DateTime.UtcNow;
            await _businessService.PostAsync(transaction, ApiURL.BankTransactionUpdate);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Delete(int id)
        {
            _tokenService.SetAuthorizationHeader();
            var account = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result.Data?.Where(a => a.Id == id).FirstOrDefault();
            await _businessService.PostAsync(account, ApiURL.BankTransactionDelete);
            return RedirectToAction("Index");
        }
    }
}
