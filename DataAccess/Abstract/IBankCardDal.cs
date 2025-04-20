using Core.DataAccess;
using Core.Entities.Concrete;
using Entities.Concrete;

namespace DataAccess.Abstract;

public interface IBankCardDal : IEntityRepository<BankCard>
{
}
