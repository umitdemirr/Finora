using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Concrete;

public class AssetManager : IAssetService
{
    private readonly IStockTransactionService _stockTransactionService;

    public AssetManager(IStockTransactionService stockTransactionService)
    {
        _stockTransactionService = stockTransactionService;
    }
    public IDataResult<List<Asset>> GetAll()
    {
        var islemler = _stockTransactionService.GetAll().Data.Where(x => x.Status == "Filled").OrderBy(x => x.Date).ToList();
        var varlikListesi = new List<Asset>();
        var sembolGruplari = islemler?.GroupBy(x => x.StockSymbol);
        foreach (var grup in sembolGruplari)
        {
            var alisKuyrugu = new Queue<StockTransaction>();
            decimal toplamKarZarar = 0;
            decimal toplamSatisMaliyeti = 0;
            foreach (var islem in grup)
            {
                string tip = islem.Type.ToUpper();

                if (tip == "BUY" || tip == "ALIŞ")
                {
                    alisKuyrugu.Enqueue(new StockTransaction
                    {
                        Price = islem.Price,
                        Quantity = islem.Quantity
                    });
                }
                else if (tip == "SOLD" || tip == "SATIŞ")
                {
                    int kalanSatis = islem.Quantity;

                    while (kalanSatis > 0 && alisKuyrugu.Any())
                    {
                        var alis = alisKuyrugu.Peek();
                        int islemAdedi = Math.Min(kalanSatis, alis.Quantity);

                        decimal maliyet = islemAdedi * alis.Price;
                        decimal gelir = islemAdedi * islem.Price;

                        toplamKarZarar += gelir - maliyet;
                        toplamSatisMaliyeti += maliyet;

                        alis.Quantity -= islemAdedi;
                        kalanSatis -= islemAdedi;

                        if (alis.Quantity == 0)
                            alisKuyrugu.Dequeue();
                    }
                }
            }

            int kalanAdet = alisKuyrugu.Sum(x => x.Quantity);
            decimal kalanTutar = alisKuyrugu.Sum(x => x.Quantity * x.Price);
            decimal ortalamaAlis = kalanAdet > 0 ? kalanTutar / kalanAdet : 0;
            decimal karZararYuzdesi = toplamSatisMaliyeti > 0? Math.Max((toplamKarZarar / toplamSatisMaliyeti) * 100, -100): 0;

            varlikListesi.Add(new Asset
            {
                Sembol = grup.Key,
                Ad = grup.First().Name,
                AssetType = grup.First().AssetType,
                AlinanAdet = grup.Where(x => x.Type.ToUpper() == "BUY").Sum(x => x.Quantity),
                AlisToplam = grup.Where(x => x.Type.ToUpper() == "BUY").Sum(x => x.Quantity * x.Price),
                SatilanAdet = grup.Where(x => x.Type.ToUpper() == "SOLD").Sum(x => x.Quantity),
                SatisToplam = grup.Where(x => x.Type.ToUpper() == "SOLD").Sum(x => x.Quantity * x.Price),
                KalanAdet = kalanAdet,
                OrtalamaAlis = Math.Round(ortalamaAlis, 2),
                KarZarar = Math.Round(toplamKarZarar, 2),
                KarZararYuzdesi = Math.Round(karZararYuzdesi, 2)
            });
        }
        return new SuccessDataResult<List<Asset>>(varlikListesi, Messages.UsersList);
    }

    public IDataResult<List<Asset>> GetByUserId(int userId)
    {
        throw new NotImplementedException();
    }

}
