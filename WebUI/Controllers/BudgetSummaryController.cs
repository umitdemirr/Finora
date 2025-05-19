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
            var model = new BankTransactionViewModel();
            var result = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result;
            model.BankTransactionList = result;
            model.BankTransactionList.Data = result?.Data?.Where(i => i.TransactionType == "Gelir").ToList();
            return View(model);
        }
        public IActionResult Expense()
        {
            var model = new BankTransactionViewModel();
            var result = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result;
            model.BankTransactionList = result;
            model.BankTransactionList.Data = result?.Data?.Where(i => i.TransactionType == "Gider").ToList();
            return View(model);
        }
        public IActionResult Debts()
        {
            return View();
        }

    }
}
