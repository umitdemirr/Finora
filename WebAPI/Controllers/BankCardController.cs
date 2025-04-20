using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BankCardController : ControllerBase
{
    private readonly IBankCardService _bankCardService;

    public BankCardController(IBankCardService bankCardService)
    {
        _bankCardService = bankCardService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _bankCardService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(BankCard bankCard)
    {
        var result = _bankCardService.Add(bankCard);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(BankCard bankCard)
    {
        var result = _bankCardService.Update(bankCard);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(BankCard bankCard)
    {
        var result = _bankCardService.Delete(bankCard);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

}