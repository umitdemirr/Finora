namespace WebUI.Services
{
    public static class ApiURL
    {
        public const string BaseUrl = "https://localhost:44324/api/";

        #region Auth Endpoint Urls
        public const string Login = BaseUrl + "Auth/login";

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
        public const string BankTransactionGetGetDetail = BaseUrl + "BankTransaction/getdetail";
        public const string BankTransactionUpdate = BaseUrl + "BankTransaction/update";
        public const string BankTransactionAdd = BaseUrl + "BankTransaction/add";
        public const string BankTransactionDelete = BaseUrl + "BankTransaction/delete";
        #endregion

    }
}
