using Business.Abstract;
using Business.Constants;
using Core.Entities.Concrete;
using Core.Utilities.Results;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Concrete;

public class BankAccountManager : IBankAccountService
{
    private readonly IBankAccountDal _bankAccountDal;

    public BankAccountManager(IBankAccountDal bankAccountDal)
    {
        _bankAccountDal = bankAccountDal;
    }

    public IResult Add(BankAccount bankAccount)
    {
        _bankAccountDal.Add(bankAccount);
        return new SuccessResult(Messages.UserAdded);

    }

    public IResult Delete(BankAccount bankAccount)
    {
        _bankAccountDal.Delete(bankAccount);
        return new SuccessResult(Messages.UserAdded);
    }

    public IDataResult<List<BankAccount>> GetAll(Expression<Func<BankAccount, bool>> filter = null)
    {
        return new SuccessDataResult<List<BankAccount>>(_bankAccountDal.GetAll(filter), Messages.UsersList);
    }

    public IResult Update(BankAccount bankAccount)
    {
        _bankAccountDal.Update(bankAccount);
        return new SuccessResult(Messages.UserAdded);
    }
}
