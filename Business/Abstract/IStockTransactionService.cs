using Core.Utilities.Results;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Abstract;
public interface IStockTransactionService
{
    IDataResult<List<StockTransaction>> GetAll(Expression<Func<StockTransaction, bool>> filter = null);
    IDataResult<List<StockTransactionDetailDto>> GetAllStockTransactionDetail();
    IDataResult<List<StockTransactionDetailDto>> GetAllStockTransactionDetailByUserId(int userId);
    IResult Add(StockTransaction stockTransaction);
    IResult Update(StockTransaction stockTransaction);
    IResult Delete(StockTransaction stockTransaction);
}