using Core.DataAccess;
using Core.Entities.Concrete;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Abstract;

public interface IBankTransactionDal : IEntityRepository<BankTransaction>
{
    List<BankTransactionDetailDto> GetAllBankTransactionDetail(int userId);
}
