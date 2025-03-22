using Core.Entities;

namespace Entities.Concrete;

public class BankAndExchange : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Country { get; set; }
    public bool IsActive { get; set; }
}