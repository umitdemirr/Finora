using Core.DataAccess.EntityFramework;
using Core.Entities.Concrete;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Concrete.EntityFramework;

public class EfBankAccountDal : EfEntityRepositoryBase<BankAccount, PostgreDbContext>, IBankAccountDal
{
    public List<BankAccountDetailDto> GetAllBankAccountDetail()
    {
        using (var context = new PostgreDbContext())
        {
            var result = from account in context.BankAccounts
                         join currency in context.Currencies on account.CurrencyId equals currency.Id
                         join bank in context.BanksAndExchanges on account.BankId equals bank.Id
                         select new BankAccountDetailDto
                         {
                             AccountId = account.Id,
                             BankId = bank.Id,
                             BankName = bank.Name,
                             AccountName = account.Name,
                             CurrencyId = currency.Id,
                             CurrencyName = currency.Code,
                             Iban = account.AccountNo,
                             Balance = account.Balance.ToString()
                         };
            return result.ToList();
        }
    }

    public List<BankAccountDetailDto> GetAllBankAccountDetailByUserId(int userId)
    {
        using (var context = new PostgreDbContext())
        {
            var result = from account in context.BankAccounts
                         join currency in context.Currencies on account.CurrencyId equals currency.Id
                         join bank in context.BanksAndExchanges on account.BankId equals bank.Id
                         where account.UserId == userId
                         select new BankAccountDetailDto
                         {
                             AccountId = account.Id,
                             BankId = bank.Id,
                             BankName = bank.Name,
                             AccountName = account.Name,
                             CurrencyId = currency.Id,
                             CurrencyName = currency.Code,
                             Iban = account.AccountNo,
                             Balance = account.Balance.ToString()
                         };
            return result.ToList();
        }
    }
}