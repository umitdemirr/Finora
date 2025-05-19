using Core.Entities;

namespace WebUI.Models;

public class BankAccountDetailDto :IDto
{
    public int AccountId { get; set; }
    public int BankId { get; set; }
    public string? BankName { get; set; }
    public string? AccountName { get; set; }
    public int CurrencyId { get; set; }
    public string? CurrencyName { get; set; }
    public string? Iban { get; set; }
    public decimal? Balance { get; set; }
}
