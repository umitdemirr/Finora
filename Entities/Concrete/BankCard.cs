using Core.Entities;

namespace Entities.Concrete;

public class BankCard : IEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BankId { get; set; }
    public string CardType { get; set; }
    public string CardNumber { get; set; }
    public string ExpiryDate { get; set; }
    public string CVV { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}