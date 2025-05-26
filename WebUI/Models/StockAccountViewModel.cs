using Entities.Concrete;
using Entities.DTOs;

namespace WebUI.Models
{
    public class StockAccountViewModel
    {
        public StockAccount MyAccount { get; set; }
        public Result<List<StockAccount>> AccountList { get; set; }
        public Result<List<BankAndExchange>> BankList { get; set; }
        public Result<List<StockAccountDetailDto>> AccountDetails { get; set; }
    }
}
