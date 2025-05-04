using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using WebUI.Models;
using WebUI.Models.Entities;
using WebUI.Services;

namespace WebUI.Controllers
{
    public class BankAccountController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly string _accountApiUrl;
        private readonly string _bankAndExchangeApiUrl;
        private readonly string _currencyApiUrl;


        public BankAccountController(IOptions<ApiSettings> options, IHttpContextAccessor contextAccessor)
        {
            _accountApiUrl = options.Value.BaseUrl + options.Value.BankAccountEndpoint;
            _bankAndExchangeApiUrl = options.Value.BaseUrl + options.Value.BankAndExchangeEndpoint;
            _currencyApiUrl = options.Value.BaseUrl + options.Value.CurrencyEndpoint;

            _contextAccessor = contextAccessor;
            _httpClient = new HttpClient();
        }
        private void SetAuthorizationHeader()
        {
            var token = _contextAccessor.HttpContext?.Request.Cookies["FinoraAccessToken"];
            if (!string.IsNullOrEmpty(token))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }
        }
        public int GetTokenInfo()
        {
            try
            {
                var token = Request.Cookies["FinoraAccessToken"];
                var handler = new JwtSecurityTokenHandler();

                if (token != null)
                {
                }
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                var id = jsonToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                return Convert.ToInt32(id);
            }
            catch (Exception)
            {
                throw new Exception("Token bilgileri okunurken hata oluştu.");
            }
        }

        public async Task<IActionResult> Index()
        {
            var model = new BankAccountViewModel();
            model.BankAccountList = GetBankAccount().Result;
            model.BankList = GetBankList().Result;
            model.CurrencyList = GetCurrency().Result;
            

            return View(model);
        }

        public async Task<IActionResult> Add(BankAccountViewModel model)
        {
            SetAuthorizationHeader();
            model.BankAccount.CreatedAt = DateTime.UtcNow;
            model.BankAccount.UpdatedAt = DateTime.UtcNow;
            model.BankAccount.UserId = GetTokenInfo();

            var json = JsonConvert.SerializeObject(model.BankAccount);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            string url = _accountApiUrl + "add";

            

            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"API Hatası: {response.StatusCode} - {responseString}");
            }

            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Update(BankAccountViewModel model)
        {
            SetAuthorizationHeader();
            var account = GetBankAccount()?.Result?.Data?.Where(a=>a.Id == model?.BankAccount?.Id).FirstOrDefault();

            account.Balance = model.BankAccount.Balance;
            account.AccountNo = model.BankAccount.AccountNo;
            account.Name = model.BankAccount.Name;
            account.BankId = model.BankAccount.BankId;
            account.CurrencyId = model.BankAccount.CurrencyId;
            account.UpdatedAt = DateTime.UtcNow;
            account.CreatedAt = DateTime.UtcNow;

            var json = JsonConvert.SerializeObject(account);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            string url = _accountApiUrl + "update";

            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"API Hatası: {response.StatusCode} - {responseString}");
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            SetAuthorizationHeader();
            var account = GetBankAccount().Result.Data.Where(a=>a.Id == id).FirstOrDefault();

            var json = JsonConvert.SerializeObject(account);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            string url = _accountApiUrl + "delete";

            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"API Hatası: {response.StatusCode} - {responseString}");
            }

            return RedirectToAction("Index");
        }

        public async Task<Result<List<BankAccount>>> GetBankAccount()
        {
            string url =  _accountApiUrl +"getall";
            var response = await _httpClient.GetAsync(url);
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Result<List<BankAccount>>>(json);

            return result;
        }
        public async Task<Result<List<BankAndExchange>>> GetBankList()
        {
            string url = _bankAndExchangeApiUrl + "getall";
            var response = await _httpClient.GetAsync(url);
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Result<List<BankAndExchange>>>(json);

            return result;
        }
        public async Task<Result<List<Currency>>> GetCurrency()
        {
            string url = _currencyApiUrl + "getall";
            var response = await _httpClient.GetAsync(url);
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Result<List<Currency>>>(json);

            return result;
        }
    }
}