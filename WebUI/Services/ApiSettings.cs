namespace WebUI.Services
{
    public class ApiSettings
    {
        public string BaseUrl { get; set; }
        public string BankAccountEndpoint { get; set; }
        public string BankAndExchangeEndpoint { get; set; }


        public string BankCardEndpoint { get; set; }
        public string CurrencyEndpoint { get; set; }
        public string UserEndpoint { get; set; }
        public string TransactionEndpoint { get; set; }
        public string AuthEndpoint { get; set; }
        public string TokenEndpoint { get; set; }
    }
}
