using Core.Entities;

namespace Entities.Concrete;

public class BankAccount : IEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BankId { get; set; }
    public string AccountNo { get; set; }
    public string Currency { get; set; }
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}