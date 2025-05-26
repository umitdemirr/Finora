using Core.Entities;
namespace Entities.DTOs;

public class StockAccountDetailDto : IDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public int ExchangeId { get; set; }
    public string ExchangeName { get; set; }
    public string AccountNo { get; set; }
    public decimal Balance { get; set; }
    public string Currency { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
