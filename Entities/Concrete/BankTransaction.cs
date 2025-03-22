using Core.Entities;

namespace Entities.Concrete;

public class BankTransaction : IEntity
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public string Type { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
}