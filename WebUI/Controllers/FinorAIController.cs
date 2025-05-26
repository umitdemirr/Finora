using Core.Entities.Concrete;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using WebUI.Models;
using WebUI.Services;

namespace WebUI.Controllers
{
    public class FinorAIController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly TokenService _tokenService;
        private readonly BusinessService _businessService;

        public FinorAIController(TokenService tokenService, HttpClient httpClient, BusinessService businessService)
        {
            _tokenService = tokenService;
            _httpClient = httpClient;
            _businessService = businessService;
        }
        public IActionResult Index()
        {
            return View();
        }


        public IActionResult Chat(AiViewModel model)
        {
            if (!model.Prompt.IsNullOrEmpty())
            {
                model.ApiKey = "AIzaSyBTRhZOPny-JCtWt9I0jVNBvSHfEBLsKIg";
                model.Model = "gemini-2.0-flash";
                var response = _businessService.GenerateWithAI(model, ApiURL.AI);
                model.Answer = response.Result.Answer;
            }
            return View(model);
        }

        public IActionResult BudgetAnalysis()
        {
            AiModelWithEntity<List<BankTransaction>> model = new AiModelWithEntity<List<BankTransaction>>();
            var view = new AiViewModel();
            model.ApiKey = "AIzaSyBTRhZOPny-JCtWt9I0jVNBvSHfEBLsKIg";
            model.Model = "gemini-2.0-flash";
            model.Url = ApiURL.BudgetAnalysis;
            model.PromptFor = "Budget";

            model.Entity = _businessService.GetAll<BankTransaction>(ApiURL.BankTransactionGetAll).Result.Data;
            var response = _businessService.AnalysisWithAI(model);
            view.Answer = Markdig.Markdown.ToHtml(response.Result.Answer);

            return View(view);
        }

        public IActionResult InvestAnalysis()
        {
            AiModelWithEntity<List<Asset>> model = new AiModelWithEntity<List<Asset>>();
            var view = new AiViewModel();
            model.ApiKey = "AIzaSyBTRhZOPny-JCtWt9I0jVNBvSHfEBLsKIg";
            model.Model = "gemini-2.0-flash";
            model.PromptFor = "Invest";
            model.Url = ApiURL.InvestAnalysis;
            model.Entity = _businessService.GetAll<Asset>(ApiURL.AssetGetAll).Result.Data;
            var response = _businessService.AnalysisWithAI(model);
            view.Answer = Markdig.Markdown.ToHtml(response.Result.Answer);

            return View(view);
        }
    }
}