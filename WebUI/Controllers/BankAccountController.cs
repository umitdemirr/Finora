using Microsoft.AspNetCore.Mvc;
using WebUI.Models;
using WebUI.Models.Entities;
using WebUI.Services;

namespace WebUI.Controllers;

public class BankAccountController : Controller
{
    private readonly HttpClient _httpClient;
    private readonly TokenService _tokenService;
    private readonly BusinessService _businessService;

    public BankAccountController(TokenService tokenService, HttpClient httpClient, BusinessService businessService)
    {
        _tokenService = tokenService;
        _httpClient = httpClient;
        _businessService = businessService;
    }

    public async Task<IActionResult> Index()
    {
        var model = new BankAccountViewModel();
        model.BankAccountDetailList = _businessService.GetAll<BankAccountDetailDto>(ApiURL.GetBankAccountDetail).Result;
        model.BankList = _businessService.GetAll<BankAndExchange>(ApiURL.BankAndExchangeGetAll).Result;
        model.CurrencyList = _businessService.GetAll<Currency>(ApiURL.CurrencyGetAll).Result;
        return View(model);
    }

    public async Task<IActionResult> Add(BankAccountViewModel model)
    {
        model.BankAccount.CreatedAt = DateTime.UtcNow;
        model.BankAccount.UpdatedAt = DateTime.UtcNow;
        model.BankAccount.UserId = _tokenService.GetTokenInfo();
        await _businessService.PostAsync(model.BankAccount, ApiURL.BankAccountAdd);
  
        return RedirectToAction("Index");
    }

    public async Task<IActionResult> Update(BankAccountViewModel model)
    {
        var account = _businessService.GetAll<BankAccount>(ApiURL.BankAccountGetAll).Result.Data?.Where(d=>d.Id == model.BankAccount?.Id).FirstOrDefault();
        account.Balance = model.BankAccount.Balance;
        account.AccountNo = model.BankAccount.AccountNo;
        account.Name = model.BankAccount.Name;
        account.BankId = model.BankAccount.BankId;
        account.CurrencyId = model.BankAccount.CurrencyId;
        account.UpdatedAt = DateTime.UtcNow;
        account.CreatedAt = DateTime.UtcNow;
        await _businessService.PostAsync(account, ApiURL.BankAccountUpdate);
        return RedirectToAction("Index");
    }

    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        var account = _businessService.GetAll<BankAccount>(ApiURL.BankAccountGetAll).Result.Data?.Where(d => d.Id == id).FirstOrDefault();
        await _businessService.PostAsync(account, ApiURL.BankAccountDelete);
        return RedirectToAction("Index");
    }
}
