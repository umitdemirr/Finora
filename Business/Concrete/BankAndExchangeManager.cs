using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Concrete;

public class BankAndExchangeManager : IBankAndExchangeService
{
    private readonly IBankAndExchangeDal _bankAndExchangeDal;

    public BankAndExchangeManager(IBankAndExchangeDal bankAndExchangeDal)
    {
        _bankAndExchangeDal = bankAndExchangeDal;
    }

    public IResult Add(BankAndExchange bankAndExchange)
    {
        _bankAndExchangeDal.Add(bankAndExchange);
        return new SuccessResult(Messages.UserAdded);
    }
    public IResult Delete(BankAndExchange bankAndExchange)
    {
        _bankAndExchangeDal.Delete(bankAndExchange);
        return new SuccessResult(Messages.UserAdded);
    }
    public IDataResult<List<BankAndExchange>> GetAll(Expression<Func<BankAndExchange, bool>> filter = null)
    {
        return new SuccessDataResult<List<BankAndExchange>>(_bankAndExchangeDal.GetAll(filter), Messages.UsersList);
    }
    public IResult Update(BankAndExchange bankAndExchange)
    {
        _bankAndExchangeDal.Update(bankAndExchange);
        return new SuccessResult(Messages.UserAdded);
    }
}