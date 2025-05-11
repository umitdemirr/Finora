using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Concrete.EntityFramework;
public class EfBankCardDal : EfEntityRepositoryBase<BankCard, PostgreDbContext>, IBankCardDal
{
    public List<BankCardDetailDto> GetAllBankCardDetailByUserId(int userId)
    {
        using (var context = new PostgreDbContext())
        {
            var result = from card in context.BankCards
                         join user in context.Users on card.UserId equals user.Id
                         join account in context.BankAccounts on card.AccountId equals account.Id
                         join bank in context.BanksAndExchanges on account.BankId equals bank.Id
                         where card.UserId == userId
                         select new BankCardDetailDto
                         {
                             Id = card.Id,
                             AccountId = card.AccountId,
                             UserId = user.Id,
                             UserName = user.FirstName + " " + user.LastName,
                             BankId = bank.Id,
                             BankName = bank.Name,
                             AccountName = account.Name,
                             CardNumber = card.Number,
                             CardName = card.Name,
                             CreatedAt = card.CreatedAt,
                             CVV =card.CVV,
                             ExpiryDate = card.ExpiryDate,
                             IsActive = card.IsActive,
                             Provider = card.Provider
                         };
            return result.ToList();
        }
    }
}