using WebUI.Models.Entities;

namespace WebUI.Models;

public class SummaryViewModel
{
    public Result<List<BankTransaction>>? BankTransactionList { get; set; }
    public Result<List<CreditCardDetailDto>>? MyCreditCards { get; set; }

    public decimal ToplamBorcum { get; set; }
    public decimal AsgariOdeme { get; set; }

    public decimal ToplamGelir { get; set; }
    public decimal AylıkOrtalamaGelir { get; set; }
    public decimal EnYuksekGelir { get; set; }
    public int GelirSayisi { get; set; }

    public decimal ToplamGider { get; set; }
    public decimal AylıkOrtalamaGider { get; set; }
    public decimal EnYüksekGider { get; set; }
    public int GiderSayisi { get; set; }


}
