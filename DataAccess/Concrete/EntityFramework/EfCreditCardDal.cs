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
                         join account in context.BankAccounts on card.BankId equals account.Id
                         where card.UserId == userId
                         select new CreditCardDetailDto
                         {
                             Id = card.Id,
                             UserId = user.Id,
                             UserName = user.FirstName + " " + user.LastName,
                             BankId = account.BankId,
                             BankName = account.Name,
                             Name = card.Name,
                             Provider = card.Provider,
                             CardNumber = card.Number,
                             ExpiryDate = card.ExpiryDate,
                             CVV = card.CVV,
                             Limit = card.Limit,
                             AvaliableLimit = card.AvaliableLimit,
                             IsActive = card.IsActive,
                         };
            return result.ToList();
        }
    }
}