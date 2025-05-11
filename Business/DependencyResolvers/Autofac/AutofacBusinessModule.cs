using Autofac;
using Autofac.Extras.DynamicProxy;
using Business.Abstract;
using Business.Concrete;
using Castle.DynamicProxy;
using Core.Utilities.Interceptors;
using Core.Utilities.Security.Jwt;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework;
using Microsoft.AspNetCore.Http;

namespace Business.DependencyResolvers.Autofac;
public class AutofacBusinessModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<UserManager>().As<IUserService>().SingleInstance();
        builder.RegisterType<EfUserDal>().As<IUserDal>().SingleInstance();

        builder.RegisterType<BankAccountManager>().As<IBankAccountService>().SingleInstance();
        builder.RegisterType<EfBankAccountDal>().As<IBankAccountDal>().SingleInstance();

        builder.RegisterType<BankAndExchangeManager>().As<IBankAndExchangeService>().SingleInstance();
        builder.RegisterType<EfBankAndExchangeDal>().As<IBankAndExchangeDal>().SingleInstance();

        builder.RegisterType<CurrencyManager>().As<ICurrencyService>().SingleInstance();
        builder.RegisterType<EfCurrencyDal>().As<ICurrencyDal>().SingleInstance();


        builder.RegisterType<BankCardManager>().As<IBankCardService>().SingleInstance();
        builder.RegisterType<EfBankCardDal>().As<IBankCardDal>().SingleInstance();

        builder.RegisterType<CreditCardManager>().As<ICreditCardService>().SingleInstance();
        builder.RegisterType<EfCreditCardDal>().As<ICreditCardDal>().SingleInstance();

        builder.RegisterType<BankTransactionManager>().As<IBankTransactionService>().SingleInstance();
        builder.RegisterType<EfBankTransactionDal>().As<IBankTransactionDal>().SingleInstance();

        builder.RegisterType<InflationManager>().As<IInflationService>().SingleInstance();
        builder.RegisterType<EfInflationDal>().As<IInflationDal>().SingleInstance();

        builder.RegisterType<PortfolioManager>().As<IPortfolioService>().SingleInstance();
        builder.RegisterType<EfPortfolioDal>().As<IPortfolioDal>().SingleInstance();

        builder.RegisterType<StockAccountManager>().As<IStockAccountService>().SingleInstance();
        builder.RegisterType<EfStockAccountDal>().As<IStockAccountDal>().SingleInstance();

        builder.RegisterType<StockTransactionManager>().As<IStockTransactionService>().SingleInstance();
        builder.RegisterType<EfStockTransactionDal>().As<IStockTransactionDal>().SingleInstance();

        builder.RegisterType<AuthManager>().As<IAuthService>().SingleInstance();
        builder.RegisterType<JwtHelper>().As<ITokenHelper>().SingleInstance();

        builder.RegisterType<HttpContextAccessor>().As<IHttpContextAccessor>();

        var assembly = System.Reflection.Assembly.GetExecutingAssembly();
        builder.RegisterAssemblyTypes(assembly).AsImplementedInterfaces()
            .EnableInterfaceInterceptors(new ProxyGenerationOptions()
            {
                Selector = new AspectInterceptorSelector()
            }).SingleInstance();
    }
}