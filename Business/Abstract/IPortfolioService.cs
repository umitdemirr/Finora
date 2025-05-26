using Core.Utilities.Results;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Abstract;
public interface IPortfolioService
{
    IDataResult<List<Portfolio>> GetAll(Expression<Func<Portfolio, bool>> filter = null);
    IDataResult<List<PortfolioDetailDto>> GetAllPortfolioDetail();
    IDataResult<List<PortfolioDetailDto>> GetAllPortfolioDetailByUserId(int userId);
    IResult Add(Portfolio portfolio);
    IResult Update(Portfolio portfolio);
    IResult Delete(Portfolio portfolio);
}