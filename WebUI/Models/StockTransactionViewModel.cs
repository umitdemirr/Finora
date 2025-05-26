using Entities.Concrete;
using Entities.DTOs;

namespace WebUI.Models;

public class StockTransactionViewModel
{
    public StockTransaction? StockTransaction { get; set; }
    public int StockId { get; set; }
    public List<StockInfo>? StockList{ get; set; }
    public List<StockInfo>? CryptoList{ get; set; }
    public List<StockInfo>? EmtiaList{ get; set; }
    public Result<List<StockTransaction>>? StockTransactionList { get; set; }
    public Result<List<StockAccountDetailDto>>? StockAccountList { get; set; }
}


public class StockInfo
{
    public int Id { get; set; }
    public string Symbol { get; set; } // THYAO
    public string Name { get; set; }   // Türk Hava Yolları
}
