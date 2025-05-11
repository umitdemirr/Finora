using Core.DataAccess;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Abstract;

public interface IBankAccountDal : IEntityRepository<BankAccount>
{
    List<BankAccountDetailDto> GetAllBankAccountDetail();
}
