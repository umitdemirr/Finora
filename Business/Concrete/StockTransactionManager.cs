using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Concrete;
public class StockTransactionManager : IStockTransactionService
{
    private IStockTransactionDal _stockTranactionDal;
    public StockTransactionManager(IStockTransactionDal stockTransactionDal)
    {
        _stockTranactionDal = stockTransactionDal;
    }

    public IResult Add(StockTransaction stockTransaction)
    {
        _stockTranactionDal.Add(stockTransaction);
        return new SuccessResult(Messages.UserAdded);
    }
    public IResult Delete(StockTransaction stockTransaction)
    {
        _stockTranactionDal.Delete(stockTransaction);
        return new SuccessResult(Messages.UserAdded);
    }
    public IDataResult<List<StockTransaction>> GetAll(Expression<Func<StockTransaction, bool>> filter = null)
    {
        return new SuccessDataResult<List<StockTransaction>>(_stockTranactionDal.GetAll(filter), Messages.UsersList);
    }

    public IDataResult<List<StockTransactionDetailDto>> GetAllStockTransactionDetail()
    {
        return new SuccessDataResult<List<StockTransactionDetailDto>>(_stockTranactionDal.GetAllStockTransactionDetail(), Messages.UsersList);
    }

    public IDataResult<List<StockTransactionDetailDto>> GetAllStockTransactionDetailByUserId(int userId)
    {
        return new SuccessDataResult<List<StockTransactionDetailDto>>(_stockTranactionDal.GetAllStockTransactionDetailByUserId(userId), Messages.UsersList);
    }

    public IResult Update(StockTransaction stockTransaction)
    {
        _stockTranactionDal.Update(stockTransaction);
        return new SuccessResult(Messages.UserAdded);
    }
}