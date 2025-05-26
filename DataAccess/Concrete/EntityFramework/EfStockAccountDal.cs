using Core.DataAccess.EntityFramework;
using Core.Entities.Concrete;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Concrete.EntityFramework;
public class EfStockAccountDal : EfEntityRepositoryBase<StockAccount, PostgreDbContext>, IStockAccountDal
{
    public List<StockAccountDetailDto> GetAllStockAccountDetail()
    {
        using (var context = new PostgreDbContext())
        {
            var result = from account in context.StockAccounts
                         join user in context.Users on account.UserId equals user.Id
                         join exchange in context.BanksAndExchanges on account.ExchangeId equals exchange.Id
                         select new StockAccountDetailDto
                         {
                             Id = account.Id,
                             UserId = user.Id,
                             UserName = user.FirstName + " " + user.LastName,
                             ExchangeId = exchange.Id,
                             ExchangeName = exchange.Name,
                             AccountNo = account.AccountNo,
                             Balance = account.Balance,
                             Currency = account.Currency,
                             CreatedAt = account.CreatedAt,
                             UpdatedAt = account.UpdatedAt
                         };
            return result.ToList();
        }
    }

    public List<StockAccountDetailDto> GetAllStockAccountDetailByUserId(int userId)
    {
        using (var context = new PostgreDbContext())
        {
            var result = from account in context.StockAccounts
                         join user in context.Users on account.UserId equals user.Id
                         join exchange in context.BanksAndExchanges on account.ExchangeId equals exchange.Id
                         where account.UserId == userId
                         select new StockAccountDetailDto
                         {
                             Id = account.Id,
                             UserId = user.Id,
                             UserName = user.FirstName + " " + user.LastName,
                             ExchangeId = exchange.Id,
                             ExchangeName = exchange.Name,
                             AccountNo = account.AccountNo,
                             Balance = account.Balance,
                             Currency = account.Currency,
                             CreatedAt = account.CreatedAt,
                             UpdatedAt = account.UpdatedAt
                         };
            return result.ToList();
        }
    }
}