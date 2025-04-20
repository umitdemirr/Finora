using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using Entities.Concrete;

namespace DataAccess.Concrete.EntityFramework;
public class EfStockTransactionDal : EfEntityRepositoryBase<StockTransaction, PostgreDbContext>, IStockTransactionDal
{
}