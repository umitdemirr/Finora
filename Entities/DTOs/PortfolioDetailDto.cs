using Core.Entities;

namespace Entities.DTOs;

public class PortfolioDetailDto : IDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public int StockAccountId { get; set; }
    public string StockSymbol { get; set; }
    public int Quantity { get; set; }
    public decimal AveragePrice { get; set; }
    public DateTime UpdatedAt { get; set; }
}
