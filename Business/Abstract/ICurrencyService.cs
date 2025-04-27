using Core.Utilities.Results;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Abstract;

public interface ICurrencyService
{
    IDataResult<List<Currency>> GetAll(Expression<Func<Currency, bool>> filter = null);
    IResult Add(Currency currency);
    IResult Update(Currency currency);
    IResult Delete(Currency currency);
}
