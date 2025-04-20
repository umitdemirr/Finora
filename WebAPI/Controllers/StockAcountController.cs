using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StockAcountController : ControllerBase
{
    private readonly IStockAccountService _stockAccountService;

    public StockAcountController(IStockAccountService stockAccountService)
    {
        _stockAccountService = stockAccountService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _stockAccountService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(StockAccount stockAccount)
    {
        var result = _stockAccountService.Add(stockAccount);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(StockAccount stockAccount)
    {
        var result = _stockAccountService.Update(stockAccount);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(StockAccount stockAccount)
    {
        var result = _stockAccountService.Delete(stockAccount);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}