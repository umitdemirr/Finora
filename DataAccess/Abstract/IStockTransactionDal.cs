using Core.DataAccess;
using Core.Entities.Concrete;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Abstract;

public interface IStockTransactionDal : IEntityRepository<StockTransaction>
{
    List<StockTransactionDetailDto> GetAllStockTransactionDetail();
    List<StockTransactionDetailDto> GetAllStockTransactionDetailByUserId(int userId);
}