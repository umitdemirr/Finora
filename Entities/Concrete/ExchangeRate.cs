using Core.Entities;
namespace Entities.Concrete;

public class ExchangeRate : IEntity
{
    public int Id { get; set; }
    public string BaseCurrency { get; set; }
    public string TargetCurrency { get; set; }
    public decimal Rate { get; set; }
    public DateTime Date { get; set; }
}