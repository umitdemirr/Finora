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
            // Banka Hesabı işlemleri
            var bankaIslemleri = from transaction in context.BankTransactions
                                 join user in context.Users on transaction.UserId equals user.Id
                                 join account in context.BankAccounts on transaction.AccountId equals account.Id
                                 where transaction.UserId == userId && transaction.PaymentType == "Banka Hesabı"
                                 select new BankTransactionDetailDto
                                 {
                                     BankTransactionId = transaction.Id,
                                     UserId = user.Id,
                                     Type = transaction.Category,
                                     AccountId = account.Id,
                                     AccountName = account.Name,
                                     PaymentType = transaction.PaymentType,
                                     Amount = transaction.Amount,
                                     Currency = transaction.Currency,
                                     TransactionType = transaction.TransactionType,
                                     Description = transaction.Description,
                                     TransactionDate = transaction.Date,
                                 };

            // Kredi Kartı işlemleri
            var krediKartiIslemleri = from transaction in context.BankTransactions
                                      join user in context.Users on transaction.UserId equals user.Id
                                      join card in context.CreditCards on transaction.AccountId equals card.Id
                                      where transaction.UserId == userId && transaction.PaymentType == "Kredi Kartı"
                                      select new BankTransactionDetailDto
                                      {
                                          BankTransactionId = transaction.Id,
                                          UserId = user.Id,
                                          Type = transaction.Category,
                                          AccountId = card.Id,
                                          AccountName = card.Name,
                                          PaymentType = transaction.PaymentType,
                                          Amount = transaction.Amount,
                                          Currency = transaction.Currency,
                                          TransactionType = transaction.TransactionType,
                                          Description = transaction.Description,
                                          TransactionDate = transaction.Date,
                                      };

            // Banka Kartı işlemleri
            var bankaKartiIslemleri = from transaction in context.BankTransactions
                                      join user in context.Users on transaction.UserId equals user.Id
                                      join card in context.BankCards on transaction.AccountId equals card.Id
                                      where transaction.UserId == userId && transaction.PaymentType == "Banka Kartı"
                                      select new BankTransactionDetailDto
                                      {
                                          BankTransactionId = transaction.Id,
                                          UserId = user.Id,
                                          Type = transaction.Category,
                                          AccountId = card.Id,
                                          AccountName = card.Name,
                                          PaymentType = transaction.PaymentType,
                                          Amount = transaction.Amount,
                                          Currency = transaction.Currency,
                                          TransactionType = transaction.TransactionType,
                                          Description = transaction.Description,
                                          TransactionDate = transaction.Date,
                                      };

            // Hepsini birleştir
            var result = bankaIslemleri
                .Union(krediKartiIslemleri)
                .Union(bankaKartiIslemleri)
                .ToList();

            return result;
        }

    }
}