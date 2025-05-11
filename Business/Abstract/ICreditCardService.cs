using Core.Utilities.Results;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Abstract
{
    public interface ICreditCardService
    {
        IDataResult<List<CreditCard>> GetAll(Expression<Func<CreditCard, bool>> filter = null);
        IResult Add(CreditCard creditCard);
        IResult Update(CreditCard creditCard);
        IResult Delete(CreditCard creditCard);

        IDataResult<List<CreditCardDetailDto>> GetAllCreditCardDetailByUserId(int userId);
    }
}
