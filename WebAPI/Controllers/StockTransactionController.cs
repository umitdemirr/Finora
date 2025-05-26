using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StockTransactionController : ControllerBase
{
    private readonly IStockTransactionService _stockTransactionService;

    public StockTransactionController(IStockTransactionService stockTransactionService)
    {
        _stockTransactionService = stockTransactionService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _stockTransactionService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
    [HttpGet("getdetail")]
    public IActionResult GetDetails()
    {
        var result = _stockTransactionService.GetAllStockTransactionDetail();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpGet("getdetailbyuserid")]
    public IActionResult GetDetailsByUserId(int userId)
    {
        var result = _stockTransactionService.GetAllStockTransactionDetailByUserId(userId);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(StockTransaction stockTransaction)
    {
        var result = _stockTransactionService.Add(stockTransaction);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(StockTransaction stockTransaction)
    {
        var result = _stockTransactionService.Update(stockTransaction);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(StockTransaction stockTransaction)
    {
        var result = _stockTransactionService.Delete(stockTransaction);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}