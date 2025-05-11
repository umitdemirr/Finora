using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Concrete;

public class BankCardManager : IBankCardService
{
    private readonly IBankCardDal _bankCardDal;

    public BankCardManager(IBankCardDal bankCardDal)
    {
        _bankCardDal = bankCardDal;
    }

    public IResult Add(BankCard bankCard)
    {
        _bankCardDal.Add(bankCard);
        return new SuccessResult(Messages.UserAdded);
    }
    public IResult Delete(BankCard bankCard)
    {
        _bankCardDal.Delete(bankCard);
        return new SuccessResult(Messages.UserAdded);
    }
    public IDataResult<List<BankCard>> GetAll(Expression<Func<BankCard, bool>> filter = null)
    {
        return new SuccessDataResult<List<BankCard>>(_bankCardDal.GetAll(filter), Messages.UsersList);
    }

    public IDataResult<List<BankCardDetailDto>> GetAllBankCardDetailByUserId(int userId)
    {
        return new SuccessDataResult<List<BankCardDetailDto>>(_bankCardDal.GetAllBankCardDetailByUserId(userId), Messages.UsersList);
    }

    public IResult Update(BankCard bankCard)
    {
        _bankCardDal.Update(bankCard);
        return new SuccessResult(Messages.UserAdded);
    }
}