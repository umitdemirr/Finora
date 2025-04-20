using Core.Utilities.Results;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Abstract;
public interface IPortfolioService
{
    IDataResult<List<Portfolio>> GetAll(Expression<Func<Portfolio, bool>> filter = null);
    IResult Add(Portfolio portfolio);
    IResult Update(Portfolio portfolio);
    IResult Delete(Portfolio portfolio);
}