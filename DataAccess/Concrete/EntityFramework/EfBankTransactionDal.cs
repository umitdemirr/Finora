using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Concrete.EntityFramework;

public class EfBankTransactionDal : EfEntityRepositoryBase<BankTransaction, PostgreDbContext>, IBankTransactionDal
{
    public List<BankTransactionDetailDto> GetAllBankTransactionDetail(int userId)
    {
        using (PostgreDbContext context = new())
        {
            var result = from transaction in context.BankTransactions
                         join account in context.BankAccounts on transaction.AccountId equals account.Id
                         join user in context.Users on account.UserId equals user.Id
                         where user.Id == userId
                         select new BankTransactionDetailDto
                         {
                             BankTransactionId = transaction.Id,
                             UserId = user.Id,
                             AccountId = account.Id,
                             AccountName = account.Name,
                             Type = transaction.Category,
                             Amount = transaction.Amount,
                             Currency = transaction.Currency,
                             TransactionType = transaction.TransactionType,
                             Description = transaction.Description,
                             TransactionDate = transaction.Date,
                         };
            return result.ToList();
        }
    }
}