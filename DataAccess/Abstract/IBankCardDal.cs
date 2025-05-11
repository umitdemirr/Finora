using Core.DataAccess;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Abstract;

public interface IBankCardDal : IEntityRepository<BankCard>
{
    List<BankCardDetailDto> GetAllBankCardDetailByUserId(int userId);
}
