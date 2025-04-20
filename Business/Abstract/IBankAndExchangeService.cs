using Core.Entities.Concrete;
using Core.Utilities.Results;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Abstract;

public interface IBankAndExchangeService
{
    IDataResult<List<BankAndExchange>> GetAll(Expression<Func<BankAndExchange, bool>> filter = null);
    IResult Add(BankAndExchange bankAndExchange);
    IResult Update(BankAndExchange bankAndExchange);
    IResult Delete(BankAndExchange bankAndExchange);
}