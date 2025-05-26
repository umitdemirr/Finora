using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Concrete.EntityFramework;
public class EfPortfolioDal : EfEntityRepositoryBase<Portfolio, PostgreDbContext>, IPortfolioDal
{
    public List<PortfolioDetailDto> GetAllPortfolioDetail()
    {
        using (var context = new PostgreDbContext())
        {
            var result = from portfolio in context.Portfolios
                         join account in context.StockAccounts on portfolio.StockAccountId equals account.Id
                         join user in context.Users on account.UserId equals user.Id
                         join exchange in context.BanksAndExchanges on account.ExchangeId equals exchange.Id
                         select new PortfolioDetailDto
                         {
                             Id = account.Id,
                             UserId = user.Id,
                             UserName = user.FirstName + " " + user.LastName,
                             StockAccountId =account.Id,
                             AveragePrice = portfolio.AveragePrice,
                             Quantity = portfolio.Quantity,
                             StockSymbol = portfolio.StockSymbol,
                             UpdatedAt = portfolio.UpdatedAt

                         };
            return result.ToList();
        }
    }

    public List<PortfolioDetailDto> GetAllPortfolioDetailByUserId(int userId)
    {
        using (var context = new PostgreDbContext())
        {
            var result = from account in context.StockAccounts
                         join user in context.Users on account.UserId equals user.Id
                         join exchange in context.BanksAndExchanges on account.ExchangeId equals exchange.Id
                         where account.UserId == userId
                         select new PortfolioDetailDto
                         {
                             Id = account.Id,
                             UserId = user.Id,
                             UserName = user.FirstName + " " + user.LastName,

                         };
            return result.ToList();
        }
    }
}