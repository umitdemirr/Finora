using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Concrete;
public class StockAccountManager : IStockAccountService
{
    private readonly IStockAccountDal _stockAccountDal;

    public StockAccountManager(IStockAccountDal stockAccountDal)
    {
        _stockAccountDal = stockAccountDal;
    }

    public IResult Add(StockAccount stockAccount)
    {
        _stockAccountDal.Add(stockAccount);
        return new SuccessResult(Messages.UserAdded);
    }
    public IResult Delete(StockAccount stockAccount)
    {
        _stockAccountDal.Delete(stockAccount);
        return new SuccessResult(Messages.UserAdded);
    }
    public IDataResult<List<StockAccount>> GetAll(Expression<Func<StockAccount, bool>> filter = null)
    {
        return new SuccessDataResult<List<StockAccount>>(_stockAccountDal.GetAll(filter), Messages.UsersList);
    }
    public IResult Update(StockAccount stockAccount)
    {
        _stockAccountDal.Update(stockAccount);
        return new SuccessResult(Messages.UserAdded);
    }
}