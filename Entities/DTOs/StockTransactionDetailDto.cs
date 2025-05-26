using Core.Entities;

namespace Entities.DTOs;

public class StockTransactionDetailDto : IDto
{
    public int Id { get; set; }
    public int StockAccountId { get; set; }
    public string StockSymbol { get; set; }//BtC
    public string Type { get; set; } // Cripto, Stock (Thyao,Froto, Btc, Eth)
    public string AssetType { get; set; } // Crypto, Stock
    public string Name { get; set; } // Bitcoin, Ethereum, Türk Hava Yolları
    public decimal Price { get; set; } // 100 TL
    public int Quantity { get; set; } // 2
    public DateTime Date { get; set; }

}
