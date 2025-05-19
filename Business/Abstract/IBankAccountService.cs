using Core.Utilities.Results;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Abstract;

public interface IBankAccountService
{
    IDataResult<List<BankAccount>> GetAll(Expression<Func<BankAccount, bool>> filter = null);
    IResult Add(BankAccount bankAccount);
    IResult Update(BankAccount bankAccount);
    IResult Delete(BankAccount bankAccount);
    IDataResult<List<BankAccountDetailDto>> GetAllBankAccountDetail();
    IDataResult<List<BankAccountDetailDto>> GetAllBankAccountDetailByUserId(int userId);
}
