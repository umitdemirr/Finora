using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;
using System.Linq.Expressions;

namespace Business.Concrete;
public class PortfolioManager : IPortfolioService
{
    private readonly IPortfolioDal _portfolioDal;

    public PortfolioManager(IPortfolioDal portfolioDal)
    {
        _portfolioDal = portfolioDal;
    }

    public IResult Add(Portfolio portfolio)
    {
        _portfolioDal.Add(portfolio);
        return new SuccessResult(Messages.UserAdded);
    }
    public IResult Delete(Portfolio portfolio)
    {
        _portfolioDal.Delete(portfolio);
        return new SuccessResult(Messages.UserAdded);
    }
    public IDataResult<List<Portfolio>> GetAll(Expression<Func<Portfolio, bool>> filter = null)
    {
        return new SuccessDataResult<List<Portfolio>>(_portfolioDal.GetAll(filter), Messages.UsersList);
    }

    public IDataResult<List<PortfolioDetailDto>> GetAllPortfolioDetail()
    {
        return new SuccessDataResult<List<PortfolioDetailDto>>(_portfolioDal.GetAllPortfolioDetail(), Messages.UsersList);
    }

    public IDataResult<List<PortfolioDetailDto>> GetAllPortfolioDetailByUserId(int userId)
    {
        return new SuccessDataResult<List<PortfolioDetailDto>>(_portfolioDal.GetAllPortfolioDetailByUserId(userId), Messages.UsersList);
    }

    public IResult Update(Portfolio portfolio)
    {
        _portfolioDal.Update(portfolio);
        return new SuccessResult(Messages.UserAdded);
    }
}