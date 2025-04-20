using Core.Utilities.Results;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Abstract;
public interface IBankTransactionService
{
    IDataResult<List<BankTransaction>> GetAll(Expression<Func<BankTransaction, bool>> filter = null);
    IResult Add(BankTransaction bankTransaction);
    IResult Update(BankTransaction bankTransaction);
    IResult Delete(BankTransaction bankTransaction);
}