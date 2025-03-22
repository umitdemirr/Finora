using Core.Entities;

namespace Entities.Concrete;

public class StockAccount : IEntity
{
    public int Id { get; set; }
    public int ExchangeId { get; set; }
    public string AccountNo { get; set; }
    public decimal Balance { get; set; }
    public string Currency { get; set; }
    public DateTime CreatedAt { get; set; }
}