using Core.DataAccess;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Abstract;

public interface IPortfolioDal : IEntityRepository<Portfolio>
{
    List<PortfolioDetailDto> GetAllPortfolioDetail();
    List<PortfolioDetailDto> GetAllPortfolioDetailByUserId(int userId);
}