using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Concrete;

public class CurrencyManager : ICurrencyService
{
    private readonly ICurrencyDal _currencyDal;

    public CurrencyManager(ICurrencyDal currencyDal)
    {
        _currencyDal = currencyDal;
    }

    public IResult Add(Currency currency)
    {
        _currencyDal.Add(currency);
        return new SuccessResult(Messages.UserAdded);
    }
    public IResult Delete(Currency currency)
    {
        _currencyDal.Delete(currency);
        return new SuccessResult(Messages.UserAdded);
    }
    public IDataResult<List<Currency>> GetAll(Expression<Func<Currency, bool>> filter = null)
    {
        return new SuccessDataResult<List<Currency>>(_currencyDal.GetAll(filter), Messages.UsersList);
    }
    public IResult Update(Currency currency)
    {
        _currencyDal.Update(currency);
        return new SuccessResult(Messages.UserAdded);
    }
}