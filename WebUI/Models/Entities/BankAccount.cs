namespace WebUI.Models.Entities;

public class BankAccount
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BankId { get; set; }
    public string? AccountNo { get; set; }
    public int? CurrencyId { get; set; }
    public decimal? Balance { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? Name { get; set; }
}