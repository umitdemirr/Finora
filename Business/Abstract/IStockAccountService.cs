using Core.Utilities.Results;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Abstract;
public interface IStockAccountService
{
    IDataResult<List<StockAccount>> GetAll(Expression<Func<StockAccount, bool>> filter = null);
    IResult Add(StockAccount stockAccount);
    IResult Update(StockAccount stockAccount);
    IResult Delete(StockAccount stockAccount);

    IDataResult<List<StockAccountDetailDto>> GetAllStockAccountDetail();
    IDataResult<List<StockAccountDetailDto>> GetAllStockAccountDetailByUserId(int userId);
}