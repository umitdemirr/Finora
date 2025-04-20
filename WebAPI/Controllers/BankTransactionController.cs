using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BankTransactionController : ControllerBase
{
    private readonly IBankTransactionService _bankTransactionService;

    public BankTransactionController(IBankTransactionService bankTransactionService)
    {
        _bankTransactionService = bankTransactionService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _bankTransactionService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(BankTransaction bankTransaction)
    {
        var result = _bankTransactionService.Add(bankTransaction);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(BankTransaction bankTransaction)
    {
        var result = _bankTransactionService.Update(bankTransaction);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(BankTransaction bankTransaction)
    {
        var result = _bankTransactionService.Delete(bankTransaction);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}
