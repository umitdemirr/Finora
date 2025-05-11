using Core.Utilities.Results;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Abstract;
public interface IBankCardService
{
    IDataResult<List<BankCard>> GetAll(Expression<Func<BankCard, bool>> filter = null);
    IResult Add(BankCard bankCard);
    IResult Update(BankCard bankCard);
    IResult Delete(BankCard bankCard);

    IDataResult<List<BankCardDetailDto>> GetAllBankCardDetailByUserId(int userId);
}