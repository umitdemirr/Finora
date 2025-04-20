using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Concrete;
public class InflationManager : IInflationService
{
    private readonly IInflationDal _inflationDal;

    public InflationManager(IInflationDal inflationDal)
    {
        _inflationDal = inflationDal;
    }

    public IResult Add(Inflation inflation)
    {
        _inflationDal.Add(inflation);
        return new SuccessResult(Messages.UserAdded);
    }
    public IResult Delete(Inflation inflation)
    {
        _inflationDal.Delete(inflation);
        return new SuccessResult(Messages.UserAdded);
    }
    public IDataResult<List<Inflation>> GetAll(Expression<Func<Inflation, bool>> filter = null)
    {
        return new SuccessDataResult<List<Inflation>>(_inflationDal.GetAll(filter), Messages.UsersList);
    }
    public IResult Update(Inflation inflation)
    {
        _inflationDal.Update(inflation);
        return new SuccessResult(Messages.UserAdded);
    }
}