using Core.Entities;
namespace Entities.Concrete;
public class StockTransaction : IEntity
{
    public int Id { get; set; }
    public int StockAccountId { get; set; }
    public string StockSymbol { get; set; }//BtC
    public string Type { get; set; } // Cripto, Stock (Thyao,Froto, Btc, Eth)
    public decimal Price { get; set; } // 100 TL
    public int Quantity { get; set; } // 2
    public decimal TotalAmount { get; set; } // 200 Tl
    public DateTime Date { get; set; } //bU ALAN 
}