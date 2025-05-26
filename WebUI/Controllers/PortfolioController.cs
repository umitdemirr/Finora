using Entities.DTOs;
using Microsoft.AspNetCore.Mvc;
using WebUI.Models;
using WebUI.Services;
namespace WebUI.Controllers;

public class PortfolioController : Controller
{
    private readonly HttpClient _httpClient;
    private readonly TokenService _tokenService;
    private readonly BusinessService _businessService;

    public PortfolioController(TokenService tokenService, HttpClient httpClient, BusinessService businessService)
    {
        _tokenService = tokenService;
        _httpClient = httpClient;
        _businessService = businessService;
    }

    public async Task<IActionResult> Index()
    {
        var model = new PortfolioViewModel();
        model.PortfolioDetails = _businessService.GetAll<PortfolioDetailDto>(ApiURL.GetPortfolioDetail).Result;
        return View(model);
    }

    public async Task<IActionResult> Add(PortfolioViewModel model)
    {
        return RedirectToAction("Index");
    }

    public async Task<IActionResult> Update(PortfolioViewModel model)
    {
        return RedirectToAction("Index");
    }

    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        return RedirectToAction("Index");
    }
}
