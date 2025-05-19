using WebUI.Models.Entities;

namespace WebUI.Models;

public class BankCardViewModel
{
    public Card? Card { get; set; }
    public Result<List<Card>>? BankCardList { get; set; }
    public Result<List<BankCardDetailDto>>? BankCardDetailList { get; set; }

    public Result<List<Card>>? CreditCardList { get; set; }
    public Result<List<CreditCardDetailDto>>? CreditCardDetailList { get; set; }

    public Result<List<BankAccount>>? Accounts { get; set; }
    public Result<List<BankTransaction>>? Transactions { get; set; }
    public Result<List<BankAndExchange>>? Banks { get; set; }
}
