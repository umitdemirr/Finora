using Core.Utilities.Results;
using Entities.Concrete;
using System.Linq.Expressions;

namespace Business.Abstract;

public interface IAssetService
{
    IDataResult<List<Asset>> GetAll();
    IDataResult<List<Asset>> GetByUserId(int userId);
}
