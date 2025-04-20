using Core.Entities.Concrete;
using Core.Utilities.Results;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Abstract;

public interface IBankAccountService
{
    IDataResult<List<BankAccount>> GetAll(Expression<Func<BankAccount, bool>> filter = null);
    IResult Add(BankAccount bankAccount);
    IResult Update(BankAccount bankAccount);
    IResult Delete(BankAccount bankAccount);
}
