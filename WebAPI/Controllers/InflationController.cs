using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InflationController : ControllerBase
{
    private readonly IInflationService _inflationService;

    public InflationController(IInflationService inflationService)
    {
        _inflationService = inflationService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _inflationService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(Inflation inflation)
    {
        var result = _inflationService.Add(inflation);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("update")]
    public IActionResult Update(Inflation inflation)
    {
        var result = _inflationService.Update(inflation);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("delete")]
    public IActionResult Delete(Inflation inflation)
    {
        var result = _inflationService.Delete(inflation);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}