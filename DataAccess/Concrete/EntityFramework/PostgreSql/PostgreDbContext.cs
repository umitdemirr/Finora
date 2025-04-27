using Core.Entities.Concrete;
using Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Concrete.EntityFramework;

public class PostgreDbContext: DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=112263;Database=Finora");
    }
   
    public DbSet<User> Users { get; set; }
    public DbSet<OperationClaim> OperationClaims { get; set; }
    public DbSet<UserOperationClaim> UserOperationClaims { get; set; }
    public DbSet<BankAccount> BankAccounts { get; set; }
    public DbSet<Currency> Currencies { get; set; }
    public DbSet<BankAndExchange> BanksAndExchanges { get; set; }
    public DbSet<BankCard> BankCards { get; set; }
    public DbSet<BankTransaction> BankTransactions { get; set; }
    public DbSet<ExchangeRate> ExchangeRates { get; set; }
    public DbSet<Inflation> Inflations { get; set; }
    public DbSet<Portfolio> Portfolios { get; set; }
    public DbSet<StockAccount> StockAccounts { get; set; }
    public DbSet<StockTransaction> StockTransactions { get; set; }
}