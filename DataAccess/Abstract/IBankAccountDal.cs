using Core.DataAccess;
using Core.Entities.Concrete;
using Entities.Concrete;

namespace DataAccess.Abstract;

public interface IBankAccountDal : IEntityRepository<BankAccount>
{
}
