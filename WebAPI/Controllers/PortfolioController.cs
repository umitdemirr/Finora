using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PortfolioController : ControllerBase
{
    private readonly IPortfolioService _portfolioService;

    public PortfolioController(IPortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _portfolioService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(Portfolio portfolio)
    {
        var result = _portfolioService.Add(portfolio);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(Portfolio portfolio)
    {
        var result = _portfolioService.Update(portfolio);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(Portfolio portfolio)
    {
        var result = _portfolioService.Delete(portfolio);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}