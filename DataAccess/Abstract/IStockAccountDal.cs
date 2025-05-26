using Core.DataAccess;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Abstract;

public interface IStockAccountDal : IEntityRepository<StockAccount>
{
    List<StockAccountDetailDto> GetAllStockAccountDetail();
    List<StockAccountDetailDto> GetAllStockAccountDetailByUserId(int userId);
}