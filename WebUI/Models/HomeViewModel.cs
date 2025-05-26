using Entities.Concrete;

namespace WebUI.Models;

public class HomeViewModel
{
    public Result<List<BankAccountDetailDto>>? BankAccountDetail { get; set; }
    public Result<List<BankTransaction>>? BankTransactions { get; set; }

    public Result<List<Asset>>? Varliklarim { get; set; }
    public decimal? TotalMoney { get; set; } = 0;
    public decimal? TotalIncome { get; set; } = 0;
    public decimal? TotalExpanse { get; set; } = 0;
    public decimal? NetWorth { get; set; } = 0;


    public List<string> Labels { get; set; } = new();
    public List<decimal> Gelirler { get; set; } = new();
    public List<decimal> Giderler { get; set; } = new();

    public List<CategoryRatioDto>? Harcamalar { get; set; }
    public List<AssetRatioDto> StockDagilimi { get; set; }
    public List<AssetRatioDto> CryptoDagilimi { get; set; }
    public List<AssetRatioDto> EmtiaDagilimi { get; set; }

}

public class CategoryRatioDto
{
    public string Category { get; set; }
    public decimal TotalAmount { get; set; }
    public double Percentage { get; set; }
}
public class AssetRatioDto
{
    public string Symbol { get; set; }
    public decimal TotalValue { get; set; }
    public double Percentage { get; set; }
}
