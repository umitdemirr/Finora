namespace WebUI.Models.Entities;

public class Card
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AccountId { get; set; }
    public int BankId { get; set; }
    public string Name { get; set; }
    public string Provider { get; set; }
    public string Number { get; set; }
    public string ExpiryDate { get; set; }
    public string CVV { get; set; }
    public decimal Limit { get; set; }
    public decimal AvaliableLimit { get; set; }
    public string Type { get; set; }
    public int StatementClosingDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
