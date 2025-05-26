using Entities.Concrete;
using Entities.DTOs;
using Microsoft.AspNetCore.Mvc;
using WebUI.Models;
using WebUI.Services;

namespace WebUI.Controllers;

public class StockTransactionController : Controller
{
    private readonly HttpClient _httpClient;
    private readonly TokenService _tokenService;
    private readonly BusinessService _businessService;

    private readonly List<StockInfo> stocks = new List<StockInfo>
        {
            new StockInfo { Id = 1, Symbol = "THYAO", Name = "Türk Hava Yolları" },
            new StockInfo { Id = 2, Symbol = "AKBNK", Name = "Akbank" },
            new StockInfo { Id = 3, Symbol = "GARAN", Name = "Garanti BBVA" },
            new StockInfo { Id = 4, Symbol = "ISCTR", Name = "İş Bankası" },
            new StockInfo { Id = 5, Symbol = "YKBNK", Name = "Yapı Kredi" },
            new StockInfo { Id = 6, Symbol = "KCHOL", Name = "Koç Holding" },
            new StockInfo { Id = 7, Symbol = "SAHOL", Name = "Sabancı Holding" },
            new StockInfo { Id = 8, Symbol = "ASELS", Name = "Aselsan" },
            new StockInfo { Id = 9, Symbol = "SISE", Name = "Şişecam" },
            new StockInfo { Id = 10, Symbol = "PETKM", Name = "Petkim" },
            new StockInfo { Id = 11, Symbol = "BIMAS", Name = "BİM" },
            new StockInfo { Id = 12, Symbol = "SASA", Name = "SASA Polyester" },
            new StockInfo { Id = 13, Symbol = "HEKTS", Name = "Hektaş" },
            new StockInfo { Id = 14, Symbol = "TUPRS", Name = "Tüpraş" },
            new StockInfo { Id = 15, Symbol = "FROTO", Name = "Ford Otosan" },
            new StockInfo { Id = 16, Symbol = "TOASO", Name = "Tofaş" },
            new StockInfo { Id = 17, Symbol = "ARCLK", Name = "Arçelik" },
            new StockInfo { Id = 18, Symbol = "ENJSA", Name = "Enerjisa" },
            new StockInfo { Id = 19, Symbol = "VESTL", Name = "Vestel" },
            new StockInfo { Id = 20, Symbol = "ALGYO", Name = "Alarko GYO" },
            new StockInfo { Id = 21, Symbol = "ALARK", Name = "Alarko Holding" },
            new StockInfo { Id = 22, Symbol = "DOHOL", Name = "Doğan Holding" },
            new StockInfo { Id = 23, Symbol = "TRKCM", Name = "Trakya Cam" },
            new StockInfo { Id = 24, Symbol = "CCOLA", Name = "Coca Cola İçecek" },
            new StockInfo { Id = 25, Symbol = "EKGYO", Name = "Emlak Konut GYO" },
            new StockInfo { Id = 26, Symbol = "KRDMD", Name = "Kardemir" },
            new StockInfo { Id = 27, Symbol = "KOZAL", Name = "Koza Altın" },
            new StockInfo { Id = 28, Symbol = "KOZAA", Name = "Koza Anadolu" },
            new StockInfo { Id = 29, Symbol = "PNSUT", Name = "Pınar Süt" },
            new StockInfo { Id = 30, Symbol = "ULKER", Name = "Ülker" }
        };
    private readonly List<StockInfo> crypto = new List<StockInfo>
{
    new StockInfo { Id = 1, Symbol = "BTC", Name = "Bitcoin" },
    new StockInfo { Id = 2, Symbol = "ETH", Name = "Ethereum" },
    new StockInfo { Id = 3, Symbol = "AVAX", Name = "Avalanche" },
    new StockInfo { Id = 4, Symbol = "SOL", Name = "Solana" },
    new StockInfo { Id = 5, Symbol = "BNB", Name = "Binance Coin" },
    new StockInfo { Id = 6, Symbol = "XRP", Name = "Ripple" },
    new StockInfo { Id = 7, Symbol = "ADA", Name = "Cardano" },
    new StockInfo { Id = 8, Symbol = "DOGE", Name = "Dogecoin" },
    new StockInfo { Id = 9, Symbol = "DOT", Name = "Polkadot" },
    new StockInfo { Id = 10, Symbol = "MATIC", Name = "Polygon" },
};
    private readonly List<StockInfo> emtia = new List<StockInfo>
{
    new StockInfo { Id = 101, Symbol = "XAU", Name = "Altın (Ons)" },
    new StockInfo { Id = 102, Symbol = "GAU", Name = "Gram Altın" },
    new StockInfo { Id = 103, Symbol = "ATA", Name = "Ata Lira" },
    new StockInfo { Id = 104, Symbol = "CEY", Name = "Çeyrek Altın" },
    new StockInfo { Id = 105, Symbol = "YAR", Name = "Yarım Altın" },
    new StockInfo { Id = 106, Symbol = "TAM", Name = "Tam Altın" },
    new StockInfo { Id = 107, Symbol = "XAG", Name = "Gümüş (Ons)" },
    new StockInfo { Id = 108, Symbol = "WTI", Name = "Ham Petrol (WTI)" },
    new StockInfo { Id = 109, Symbol = "BRENT", Name = "Ham Petrol (Brent)" },
    new StockInfo { Id = 110, Symbol = "NG", Name = "Doğal Gaz" },
    new StockInfo { Id = 111, Symbol = "HG", Name = "Bakır" },
    new StockInfo { Id = 112, Symbol = "PL", Name = "Platin" },
    new StockInfo { Id = 113, Symbol = "PA", Name = "Paladyum" },
    new StockInfo { Id = 114, Symbol = "ZC", Name = "Mısır" },
    new StockInfo { Id = 115, Symbol = "ZS", Name = "Soya Fasulyesi" },
};


    public StockTransactionController(TokenService tokenService, HttpClient httpClient, BusinessService businessService)
    {
        _tokenService = tokenService;
        _httpClient = httpClient;
        _businessService = businessService;
    }
    public IActionResult Index()
    {

        var model = new StockTransactionViewModel();
        model.StockTransactionList = _businessService.GetAll<StockTransaction>(ApiURL.StockTransactionGetAll).Result;
        model.StockAccountList = _businessService.GetAll<StockAccountDetailDto>(ApiURL.GetStockAccountDetail).Result;
        model.StockList = stocks;
        model.CryptoList = crypto;
        model.EmtiaList = emtia;
        return View(model);
    }

    public async Task<IActionResult> Add(StockTransactionViewModel model)
    {
        if (model.StockTransaction.AssetType == "CRYPTO")
        {
            model.StockTransaction.StockSymbol = crypto.Where(x => x.Id == model.StockId).FirstOrDefault().Symbol;
            model.StockTransaction.Name = crypto.Where(x => x.Id == model.StockId).FirstOrDefault().Name;
        }
        else if (model.StockTransaction.AssetType == "STOCK")
        {
            model.StockTransaction.StockSymbol = stocks.Where(x => x.Id == model.StockId).FirstOrDefault().Symbol;
            model.StockTransaction.Name = stocks.Where(x => x.Id == model.StockId).FirstOrDefault().Name;
        }
        else if (model.StockTransaction.AssetType == "EMTIA")
        {
            model.StockTransaction.StockSymbol = emtia.Where(x => x.Id == model.StockId).FirstOrDefault().Symbol;
            model.StockTransaction.Name = emtia.Where(x => x.Id == model.StockId).FirstOrDefault().Name;
        }
        model.StockTransaction.Date = DateTime.UtcNow;
        await _businessService.PostAsync(model.StockTransaction, ApiURL.StockTransactionAdd);
        return RedirectToAction("Index");
    } 
    public async Task<IActionResult> Update(StockTransactionViewModel model)
    {
        var transaction = _businessService.GetAll<StockTransaction>(ApiURL.StockTransactionGetAll).Result.Data?.Where(d => d.Id == model.StockTransaction?.Id).FirstOrDefault();
        transaction.Date = DateTime.UtcNow;
        await _businessService.PostAsync(transaction, ApiURL.StockTransactionUpdate);
        return RedirectToAction("Index");
    }

    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        var account = _businessService.GetAll<StockTransaction>(ApiURL.StockTransactionGetAll).Result.Data?.Where(d => d.Id == id).FirstOrDefault();
        await _businessService.PostAsync(account, ApiURL.StockTransactionDelete);
        return RedirectToAction("Index");
    }
}
