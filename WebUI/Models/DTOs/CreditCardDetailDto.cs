using Core.Entities;

namespace WebUI.Models;

public class CreditCardDetailDto : IDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public int BankId { get; set; }
    public string BankName { get; set; }
    public string Name { get; set; }
    public string Provider { get; set; }
    public string CardNumber { get; set; }
    public string ExpiryDate { get; set; }
    public string CVV { get; set; }
    public decimal Limit { get; set; }
    public decimal AvaliableLimit { get; set; }
    public int StatementClosingDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
