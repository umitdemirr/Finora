using Microsoft.AspNetCore.Mvc;
using WebUI.Models;
using WebUI.Models.Entities;
using WebUI.Services;

namespace WebUI.Controllers;

public class CardController : Controller
{
    private readonly HttpClient _httpClient;
    private readonly TokenService _tokenService;
    private readonly BusinessService _businessService;

    public CardController(TokenService tokenService, BusinessService businessService)
    {
        _httpClient = new HttpClient();
        _tokenService = tokenService;
        _businessService = businessService;
    }

    public async Task<IActionResult> Index()
    {
        var model = new BankCardViewModel();
        model.BankCardDetailList = _businessService.GetByUserId<BankCardDetailDto>(ApiURL.GetAllBankCardDetailByUserId).Result;
        model.CreditCardDetailList = _businessService.GetByUserId<CreditCardDetailDto>(ApiURL.GetAllCreditCardDetailByUserId).Result;

        model.Accounts = _businessService.GetAll<BankAccount>(ApiURL.BankAccountGetAll).Result;
        model.Transactions = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetDetail).Result;
        model.Banks = _businessService.GetAll<BankAndExchange>(ApiURL.BankAndExchangeGetAll).Result;
        return View(model);
    }


    public async Task<IActionResult> Add(BankCardViewModel model)
    {
        model.Card.CreatedAt = DateTime.UtcNow;
        model.Card.UserId = _tokenService.GetTokenInfo();
        model.Card.IsActive = true;

        if (model.Card.Type == "creditcard")
        {
            await _businessService.PostAsync(model.Card, ApiURL.CreditCardAdd);
        }
        else if (model.Card.Type == "bankcard")
        {
            await _businessService.PostAsync(model.Card, ApiURL.BankCardAdd);
        }
        return RedirectToAction("Index");
    }

    public async Task<IActionResult> Update(BankCardViewModel model)
    {
        if (model.Card.Type == "creditcard")
        {
            var card = _businessService.GetAll<Card>(ApiURL.CreditCardGetAll).Result.Data?.Where(d => d.Id == model.Card?.Id).FirstOrDefault();

            card.BankId = model.Card.BankId;
            card.AvaliableLimit = model.Card.AvaliableLimit;
            card.Name = model.Card.Name;
            card.Provider = model.Card.Provider;
            card.Number = model.Card.Number;
            card.ExpiryDate = model.Card.ExpiryDate;
            card.CVV = model.Card.CVV;
            card.Limit = model.Card.Limit;
            card.AvaliableLimit = model.Card.AvaliableLimit;

            card.CreatedAt = DateTime.UtcNow;
            await _businessService.PostAsync(card, ApiURL.CreditCardUpdate);
        }
        else if (model.Card.Type == "bankcard")
        {
            var card = _businessService.GetAll<Card>(ApiURL.BankCardGetAll).Result.Data?.Where(d => d.Id == model.Card?.Id).FirstOrDefault();
            
            card.AvaliableLimit = model.Card.AvaliableLimit;
            card.AccountId = model.Card.AccountId;
            card.Number = model.Card.Number;
            card.Provider = model.Card.Provider;
            card.ExpiryDate = model.Card.ExpiryDate;
            card.CVV = model.Card.CVV;
            card.Limit = model.Card.Limit;
            card.AvaliableLimit = model.Card.AvaliableLimit;
            card.CreatedAt = DateTime.UtcNow;
            await _businessService.PostAsync(card, ApiURL.BankCardUpdate);
        }

        return RedirectToAction("Index");
    }

    [HttpPost]
    public async Task<IActionResult> Delete(int id, string type)
    {
        _tokenService.SetAuthorizationHeader();

        if (type == "bankCard")
        {
            var card = _businessService.GetAll<Card>(ApiURL.BankCardGetAll).Result.Data?.Where(d => d.Id == id).FirstOrDefault();
            await _businessService.PostAsync(card, ApiURL.BankCardDelete);
        }
        else if (type == "creditCard")
        {
            var card = _businessService.GetAll<Card>(ApiURL.CreditCardGetAll).Result.Data?.Where(d => d.Id == id).FirstOrDefault();
            await _businessService.PostAsync(card, ApiURL.CreditCardDelete);
        }
        return RedirectToAction("Index");
    }

}
