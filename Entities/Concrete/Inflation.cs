using Core.Entities;
namespace Entities.Concrete;

public class Inflation : IEntity
{
    public int Id { get; set; }
    public string Country { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal InflationRate { get; set; }
}