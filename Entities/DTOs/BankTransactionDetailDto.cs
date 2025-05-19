using Core.Entities;

namespace Entities.DTOs;

public class BankTransactionDetailDto : IDto
{
    public int BankTransactionId { get; set; }
    public int UserId { get; set; }
    public int AccountId { get; set; }
    public string? AccountName { get; set; }
    public string? Type { get; set; }
    public decimal Amount { get; set; }
    public string? TransactionType { get; set; }
    public string? Currency { get; set; }
    public string? Description { get; set; }
    public DateTime TransactionDate { get; set; }
}
