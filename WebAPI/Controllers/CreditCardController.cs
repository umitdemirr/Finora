using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CreditCardController : ControllerBase
{
    private readonly ICreditCardService _creditCardService;

    public CreditCardController(ICreditCardService creditCardService)
    {
        _creditCardService = creditCardService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _creditCardService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpGet("getdetail")]
    public IActionResult GetCardDetail(int userId)
    {
        var result = _creditCardService.GetAllCreditCardDetailByUserId(userId);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(CreditCard creditCard)
    {
        var result = _creditCardService.Add(creditCard);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(CreditCard creditCard)
    {
        var result = _creditCardService.Update(creditCard);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(CreditCard creditCard)
    {
        var result = _creditCardService.Delete(creditCard);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}
