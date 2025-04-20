using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using Entities.Concrete;

namespace DataAccess.Concrete.EntityFramework;
public class EfPortfolioDal : EfEntityRepositoryBase<Portfolio, PostgreDbContext>, IPortfolioDal
{
}