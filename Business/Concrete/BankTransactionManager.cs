using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Concrete;
public class BankTransactionManager : IBankTransactionService
{
    private readonly IBankTransactionDal _bankTransactionDal;

    public BankTransactionManager(IBankTransactionDal bankTransactionDal)
    {
        _bankTransactionDal = bankTransactionDal;
    }

    public IResult Add(BankTransaction bankTransaction)
    {
        _bankTransactionDal.Add(bankTransaction);
        return new SuccessResult(Messages.UserAdded);
    }
    public IResult Delete(BankTransaction bankTransaction)
    {
        _bankTransactionDal.Delete(bankTransaction);
        return new SuccessResult(Messages.UserAdded);
    }
    public IDataResult<List<BankTransaction>> GetAll(Expression<Func<BankTransaction, bool>> filter = null)
    {
        return new SuccessDataResult<List<BankTransaction>>(_bankTransactionDal.GetAll(filter), Messages.UsersList);
    }
    public IResult Update(BankTransaction bankTransaction)
    {
        _bankTransactionDal.Update(bankTransaction);
        return new SuccessResult(Messages.UserAdded);
    }
}