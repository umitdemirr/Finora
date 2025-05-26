using Entities.DTOs;
using WebUI.Models.Entities;

namespace WebUI.Models;

public class BankAccountViewModel
{
    public Result<List<BankAccount>>? BankAccountList { get; set; }

    public BankAccount? BankAccount { get; set; }
    public Currency? Currency { get; set; }

    public Result<List<BankAndExchange>>? BankList { get; set; }
    public Result<List<Currency>>? CurrencyList { get; set; }

    public Result<List<BankAccountDetailDto>>? BankAccountDetailList { get; set; }
    public Result<List<BankTransaction>>? Transactions { get; set; }
    public BankAccountDetailDto? BankAccountDetail { get; set; }

}