using WebUI.Models.Entities;

namespace WebUI.Models;

public class HomeViewModel
{
    public Result<List<BankAccountDetailDto>>? BankAccountDetail { get; set; }
    public Result<List<BankTransaction>>? BankTransactions { get; set; }
    public decimal? TotalMoney { get; set; } = 0;
    public decimal? TotalIncome { get; set; } = 0;
    public decimal? TotalExpanse { get; set; } = 0;
    public decimal? NetWorth { get; set; } = 0;


    public List<string> Labels { get; set; } = new();
    public List<decimal> Gelirler { get; set; } = new();
    public List<decimal> Giderler { get; set; } = new();

}
