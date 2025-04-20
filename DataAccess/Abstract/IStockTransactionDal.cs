using Core.DataAccess;
using Core.Entities.Concrete;
using Entities.Concrete;

namespace DataAccess.Abstract;

public interface IStockTransactionDal : IEntityRepository<StockTransaction>
{
}