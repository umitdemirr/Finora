﻿using Core.DataAccess.EntityFramework;
using Core.Entities.Concrete;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.DTOs;

namespace DataAccess.Concrete.EntityFramework;
public class EfUserDal : EfEntityRepositoryBase<User, PostgreDbContext>, IUserDal
{
    public List<OperationClaim> GetClaims(User user)
    {
        using (var context = new PostgreDbContext())
        {
            var result = from operationClaim in context.OperationClaims
                         join userOperationClaim in context.UserOperationClaims
                             on operationClaim.Id equals userOperationClaim.OperationClaimId
                         where userOperationClaim.UserId == user.Id
                         select new OperationClaim { Id = operationClaim.Id, Name = operationClaim.Name , Description = operationClaim.Description};
            return result.ToList();
        }
    }
}
