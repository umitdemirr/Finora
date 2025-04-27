using Core.Entities;

namespace Entities.Concrete;

public class Portfolio : IEntity
{
    public int Id { get; set; }
    public int StockAccountId { get; set; }
    public string StockSymbol { get; set; }
    public int Quantity { get; set; }
    public decimal AveragePrice { get; set; }
    public DateTime UpdatedAt { get; set; }
}