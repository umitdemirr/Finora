using Core.Utilities.Results;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Abstract;
public interface IInflationService
{
    IDataResult<List<Inflation>> GetAll(Expression<Func<Inflation, bool>> filter = null);
    IResult Add(Inflation inflation);
    IResult Update(Inflation inflation);
    IResult Delete(Inflation inflation);
}