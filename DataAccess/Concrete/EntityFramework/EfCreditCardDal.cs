using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Concrete.EntityFramework;

public class EfCreditCardDal : EfEntityRepositoryBase<CreditCard, PostgreDbContext>, ICreditCardDal
{
    public List<CreditCardDetailDto> GetAllCreditCardDetailByUserId(int userId)
    {
        using (var context = new PostgreDbContext())
        {
            var result = from card in context.CreditCards
                         join user in context.Users on card.UserId equals user.Id
                         join bank in context.BanksAndExchanges on card.BankId equals bank.Id
                         where card.UserId == userId
                         select new CreditCardDetailDto
                         {
                             Id = card.Id,
                             UserId = user.Id,
                             UserName = user.FirstName + " " + user.LastName,
                             BankId = bank.Id,
                             BankName = bank.Name,
                             Name = card.Name,
                             Provider = card.Provider,
                             CardNumber = card.Number,
                             ExpiryDate = card.ExpiryDate,
                             CVV = card.CVV,
                             Limit = card.Limit,
                             AvaliableLimit = card.AvaliableLimit,
                             StatementClosingDate = card.StatementClosingDate,
                             IsActive = card.IsActive,
                         };
            return result.ToList();
        }
    }
}