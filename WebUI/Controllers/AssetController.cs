using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;
using WebUI.Models;
using WebUI.Services;

namespace WebUI.Controllers
{
    public class AssetController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly TokenService _tokenService;
        private readonly BusinessService _businessService;

        public AssetController(TokenService tokenService, HttpClient httpClient, BusinessService businessService)
        {
            _tokenService = tokenService;
            _httpClient = httpClient;
            _businessService = businessService;
        }
        public IActionResult Index()
        {
            var model = new AssetViewModel();
            model.MyAssets = _businessService.GetAll<Asset>(ApiURL.AssetGetAll).Result;
            return View(model);
        }
    }
}
