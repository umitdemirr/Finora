using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Concrete;

public class CreditCardManager : ICreditCardService
{
    private readonly ICreditCardDal _creditCardDal;
    public CreditCardManager(ICreditCardDal creditCardDal)
    {
        _creditCardDal = creditCardDal;
    }

    public IResult Add(CreditCard creditCard)
    {
        _creditCardDal.Add(creditCard);
        return new SuccessResult(Messages.CreditCardAdded);
    }

    public IResult Delete(CreditCard creditCard)
    {
        _creditCardDal.Delete(creditCard);
        return new SuccessResult(Messages.CreditCardDeleted);
    }

    public IDataResult<List<CreditCard>> GetAll(Expression<Func<CreditCard, bool>> filter = null)
    {
        return new SuccessDataResult<List<CreditCard>>(_creditCardDal.GetAll(filter), Messages.CreditCardList);
    }

    public IDataResult<List<CreditCardDetailDto>> GetAllCreditCardDetailByUserId(int userId)
    {
        return new SuccessDataResult<List<CreditCardDetailDto>>(_creditCardDal.GetAllCreditCardDetailByUserId(userId), Messages.CreditCardDetailList);
    }

    public IResult Update(CreditCard creditCard)
    {
        _creditCardDal.Update(creditCard);
        return new SuccessResult(Messages.CreditCardUpdated);
    }
}
