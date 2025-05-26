using Core.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Entities.Concrete;
public class StockTransaction : IEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int StockAccountId { get; set; }
    public string StockSymbol { get; set; }//BtC
    public string Type { get; set; } // Thyao,Froto, Btc, Eth
    public string AssetType { get; set; } // Crypto, Stock
    public string Name { get; set; } // Bitcoin, Ethereum, Türk Hava Yolları
    public string Status { get; set; } 
    public decimal Price { get; set; } // 100 TL
    public int Quantity { get; set; } // 2
    public DateTime Date { get; set; } //bU ALAN 
}