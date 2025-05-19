using WebUI.Models.Entities;

namespace WebUI.Models
{
    public class BankTransactionViewModel
    {
        public BankTransaction? BankTransaction{ get; set; }
        public Result<List<BankTransaction>>? BankTransactionList { get; set; }
        public Result<List<BankAccount>>? BankAccountList { get; set; }
        public Result<List<BankAndExchange>>? BankList { get; set; }
        public Result<List<Card>>? CreditCardList { get; set; }
        public Result<List<Card>>? BankCardList { get; set; }
    }
}
