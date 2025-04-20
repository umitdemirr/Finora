using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BankAndExchangeController : ControllerBase
{
    private readonly IBankAndExchangeService _bankAndExchangeService;
    public BankAndExchangeController(IBankAndExchangeService bankAndExchangeService)
    {
        _bankAndExchangeService = bankAndExchangeService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _bankAndExchangeService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(BankAndExchange bankAndExchange)
    {
        var result = _bankAndExchangeService.Add(bankAndExchange);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(BankAndExchange bankAndExchange)
    {
        var result = _bankAndExchangeService.Update(bankAndExchange);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(BankAndExchange bankAndExchange)
    {
        var result = _bankAndExchangeService.Delete(bankAndExchange);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}