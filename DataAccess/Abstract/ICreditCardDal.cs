using Core.DataAccess;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Abstract
{
    public interface ICreditCardDal : IEntityRepository<CreditCard>
    {
        List<CreditCardDetailDto> GetAllCreditCardDetailByUserId(int userId);
    }
}
