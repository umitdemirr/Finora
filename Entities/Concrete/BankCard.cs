using Core.Entities;

namespace Entities.Concrete;

public class BankCard : IEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AccountId { get; set; }
    public string Name { get; set; }
    public string Provider { get; set; }
    public string Number { get; set; }
    public string ExpiryDate { get; set; }
    public string CVV { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }

}