﻿using Core.DataAccess;
using Core.Entities.Concrete;
using Entities.Concrete;

namespace DataAccess.Abstract;

public interface IInflationDal : IEntityRepository<Inflation>
{
}
