namespace WebUI.Services
{
    public static class ApiURL
    {
        public const string BaseUrl = "https://localhost:44324/api/";
        


        #region Auth Endpoint Urls
        public const string Login = BaseUrl + "Auth/login";
        public const string AI = BaseUrl + "Ai/simple-prompt";
        public const string InvestAnalysis = BaseUrl + "Ai/invest-analysis";
        public const string BudgetAnalysis = BaseUrl + "Ai/budget-analysis";
        #endregion

        #region BankAccount Endpoint Urls
        public const string BankAccountGetAll = BaseUrl+"BankAccount/getall";
        public const string BankAccountUpdate = BaseUrl + "BankAccount/update";
        public const string BankAccountAdd = BaseUrl + "BankAccount/add";
        public const string BankAccountDelete = BaseUrl + "BankAccount/delete";
        public const string GetBankAccountDetail = BaseUrl + "BankAccount/getdetail";
        #endregion

        #region BankCard Endpoint Urls
        public const string BankCardGetAll = BaseUrl + "BankCard/getall";
        public const string BankCardUpdate = BaseUrl + "BankCard/update";
        public const string BankCardAdd = BaseUrl + "BankCard/add";
        public const string BankCardDelete = BaseUrl + "BankCard/delete";
        public const string GetAllBankCardDetailByUserId = BaseUrl + "BankCard/getdetail";
        #endregion

        #region CreditCard Endpoint Urls
        public const string CreditCardGetAll = BaseUrl + "CreditCard/getall";
        public const string CreditCardUpdate = BaseUrl + "CreditCard/update";
        public const string CreditCardAdd = BaseUrl + "CreditCard/add";
        public const string CreditCardDelete = BaseUrl + "CreditCard/delete";
        public const string GetAllCreditCardDetailByUserId = BaseUrl + "CreditCard/getdetail";
        #endregion

        #region BankAndExchange Endpoint Urls
        public const string BankAndExchangeGetAll = BaseUrl + "BankAndExchange/getall";
        public const string BankAndExchangeUpdate = BaseUrl + "BankAndExchange/update";
        public const string BankAndExchangeAdd = BaseUrl + "BankAndExchange/add";
        public const string BankAndExchangeDelete = BaseUrl + "BankAndExchange/delete";
        #endregion

        #region Currency Endpoint Urls
        public const string CurrencyGetAll = BaseUrl + "Currency/getall";
        public const string CurrencyUpdate = BaseUrl + "Currency/update";
        public const string CurrencyAdd = BaseUrl + "Currency/add";
        public const string CurrencyDelete = BaseUrl + "Currency/delete";
        #endregion

        #region BankTransaction Endpoint Urls
        public const string BankTransactionGetAll = BaseUrl + "BankTransaction/getall";
        public const string BankTransactionGetDetail = BaseUrl + "BankTransaction/getdetail";
        public const string BankTransactionUpdate = BaseUrl + "BankTransaction/update";
        public const string BankTransactionAdd = BaseUrl + "BankTransaction/add";
        public const string BankTransactionDelete = BaseUrl + "BankTransaction/delete";
        #endregion

        #region StockAccount Endpoint Urls
        public const string StockAccountGetAll = BaseUrl + "StockAcount/getall";
        public const string StockAccountUpdate = BaseUrl + "StockAcount/update";
        public const string StockAccountAdd = BaseUrl + "StockAcount/add";
        public const string StockAccountDelete = BaseUrl + "StockAcount/delete";
        public const string GetStockAccountDetail = BaseUrl + "StockAcount/getdetail";
        public const string GetStockAccountDetailByUserId = BaseUrl + "StockAcount/getdetailbyuserid";
        #endregion

        #region Portfolio Endpoint Urls
        public const string PortfolioGetAll = BaseUrl + "Portfolio/getall";
        public const string PortfolioUpdate = BaseUrl + "Portfolio/update";
        public const string PortfolioAdd = BaseUrl + "Portfolio/add";
        public const string PortfolioDelete = BaseUrl + "Portfolio/delete";
        public const string GetPortfolioDetail = BaseUrl + "Portfolio/getdetail";
        public const string GetPortfolioDetailByUserId = BaseUrl + "Portfolio/getdetailbyuserid";
        #endregion

        #region StockTransaction Endpoint Urls
        public const string StockTransactionGetAll = BaseUrl + "StockTransaction/getall";
        public const string StockTransactionUpdate = BaseUrl + "StockTransaction/update";
        public const string StockTransactionAdd = BaseUrl + "StockTransaction/add";
        public const string StockTransactionDelete = BaseUrl + "StockTransaction/delete";
        public const string GetStockTransactionDetail = BaseUrl + "StockTransaction/getdetail";
        public const string GetStockTransactionDetailByUserId = BaseUrl + "StockTransaction/getdetailbyuserid";
        #endregion

        #region Asset Endpoint Urls
        public const string AssetGetAll = BaseUrl + "Asset/getall";
        public const string AssetDetailByUserId = BaseUrl + "Asset/getbyuserid";
        #endregion
    }
}
