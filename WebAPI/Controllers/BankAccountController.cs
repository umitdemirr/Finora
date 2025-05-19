using Business.Abstract;
using Core.Entities.Concrete;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BankAccountController : ControllerBase
{
    private readonly IBankAccountService  _bankAccountService;
    public BankAccountController(IBankAccountService bankAccountService)
    {
        _bankAccountService = bankAccountService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _bankAccountService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpGet("getdetail")]
    public IActionResult GetDetails()
    {
        var result = _bankAccountService.GetAllBankAccountDetail();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpGet("getdetailbyuserid")]
    public IActionResult GetDetailsByUserId(int userId)
    {
        var result = _bankAccountService.GetAllBankAccountDetailByUserId(userId);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(BankAccount bankAccount)
    {
        var result = _bankAccountService.Add(bankAccount);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(BankAccount bankAccount)
    {
        var result = _bankAccountService.Update(bankAccount);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(BankAccount bankAccount)
    {
        var result = _bankAccountService.Delete(bankAccount);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}
