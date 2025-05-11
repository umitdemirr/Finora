using System.Net.Http.Headers;
using System.Net.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace WebUI.Services
{
    public class TokenService
    {
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _contextAccessor;
        public TokenService(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
            _httpClient = new HttpClient();
        }

        public void SetAuthorizationHeader()
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
                var token = _contextAccessor.HttpContext?.Request.Cookies["FinoraAccessToken"];
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
    }
}
