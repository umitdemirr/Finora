using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using WebUI.Models;

namespace WebUI.Controllers;

public class AuthController : Controller
{
    private readonly HttpClient _httpClient;
    public AuthController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpGet]
    public IActionResult Login(LoginViewModel model)
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> LoginAsync(LoginViewModel model)
    {
        string requestUrl = "https://localhost:44324/api/Auth/login";
        var json = JsonConvert.SerializeObject(model);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(requestUrl, content);

        var responseString = await response.Content.ReadAsStringAsync();
        var jsonResponse = JsonConvert.DeserializeObject<LoginViewModel>(responseString);


        var cookieOption = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = jsonResponse.Expiration
        };
        Response.Cookies.Append("FinoraAccessToken", jsonResponse.Token, cookieOption);

        return RedirectToAction("Index","Home");

    }
}