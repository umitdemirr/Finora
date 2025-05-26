using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Concrete.EntityFramework;
public class EfStockTransactionDal : EfEntityRepositoryBase<StockTransaction, PostgreDbContext>, IStockTransactionDal
{
    public List<StockTransactionDetailDto> GetAllStockTransactionDetail()
    {
        using (var context = new PostgreDbContext())
        {
            var result = from transaction in context.StockTransaction
                         join account in context.StockAccounts on transaction.StockAccountId equals account.Id
                         join user in context.Users on account.UserId equals user.Id
                         select new StockTransactionDetailDto
                         {
                             Id = account.Id,
                         };
            return result.ToList();
        }
    }

    public List<StockTransactionDetailDto> GetAllStockTransactionDetailByUserId(int userId)
    {
        using (var context = new PostgreDbContext())
        {
            var result = from transaction in context.StockTransaction
                         join account in context.StockAccounts on transaction.StockAccountId equals account.Id
                         join user in context.Users on account.UserId equals user.Id
                         where account.UserId == userId
                         select new StockTransactionDetailDto
                         {
                             Id = account.Id,
                         };
            return result.ToList();
        }
    }
}