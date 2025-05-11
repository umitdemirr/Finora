using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Concrete;
public class BankTransactionManager : IBankTransactionService
{
    private readonly IBankTransactionDal _bankTransactionDal;
    private readonly IBankCardService _bankCardService;
    private readonly ICreditCardService _creditCardService;
    private readonly IBankAccountService _bankAccountService;

    public BankTransactionManager(IBankTransactionDal bankTransactionDal, IBankAccountService bankAccountService, IBankCardService bankCardService, ICreditCardService creditCardService)
    {
        _bankTransactionDal = bankTransactionDal;
        _bankAccountService = bankAccountService;
        _bankCardService = bankCardService;
        _creditCardService = creditCardService;
    }

    public IResult Add(BankTransaction bankTransaction)
    {
        if (bankTransaction.PaymentType == Constant.PaymentTypeCreditCard)
        {
            var creditCard = _creditCardService.GetAll().Data.Where(cc => cc.Id == bankTransaction.AccountId).FirstOrDefault();

            if (bankTransaction.Amount <= creditCard.AvaliableLimit)
            {
                creditCard.AvaliableLimit = creditCard.AvaliableLimit - bankTransaction.Amount;
                creditCard.UpdatedAt = DateTime.UtcNow;
                creditCard.CreatedAt = DateTime.UtcNow;
                _creditCardService.Update(creditCard);
            }
            else
            {
                return new ErrorResult(Messages.TransactionAmountExceedsLimit);
            }
        }
        if (bankTransaction.PaymentType == Constant.PaymentTypeBankCard)
        {
            var bankCard = _bankCardService.GetAll().Data.Where(bc => bc.Id == bankTransaction.AccountId).FirstOrDefault();
            var account = _bankAccountService.GetAll().Data.Where(a => a.Id == bankCard.AccountId).FirstOrDefault();
            if (account?.Balance >= bankTransaction.Amount)
            {
                account.Balance = account.Balance - bankTransaction.Amount;
                _bankAccountService.Update(account);
            }
            else
            {
                return new ErrorResult(Messages.InsufficientBalance);
            }
        }

        if (bankTransaction.PaymentType == Constant.PaymentTypeBankAccount)
        {
            var account = _bankAccountService.GetAll().Data.Where(a => a.Id == bankTransaction.AccountId).FirstOrDefault();

            if (bankTransaction.TransactionType == Constant.Income)
            {
                account.Balance = account.Balance + bankTransaction.Amount;
                account.UpdatedAt = DateTime.UtcNow;
                account.CreatedAt = DateTime.UtcNow;
            }
            if (bankTransaction.TransactionType == Constant.Expense)
            {
                if (bankTransaction.Amount <= account.Balance)
                {
                    account.Balance = account.Balance - bankTransaction.Amount;
                    account.UpdatedAt = DateTime.UtcNow;
                    account.CreatedAt = DateTime.UtcNow;
                }
                else
                {
                    return new ErrorResult(Messages.InsufficientBalance);
                }
            } 
            _bankAccountService.Update(account);
        }
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

    public IDataResult<List<BankTransactionDetailDto>> GetAllBankTransactionDetail(int userId)
    {
        return new SuccessDataResult<List<BankTransactionDetailDto>>(_bankTransactionDal.GetAllBankTransactionDetail(userId), Messages.UsersList);
    }

    public IResult Update(BankTransaction bankTransaction)
    {
        _bankTransactionDal.Update(bankTransaction);
        return new SuccessResult(Messages.UserAdded);
    }
}