using Business.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssetController : ControllerBase
{
    private readonly IAssetService _assetService;
    public AssetController(IAssetService assetService)
    {
        _assetService = assetService;
    }

    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _assetService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
    [HttpGet("getbyuserid")]
    public IActionResult GetByUserId(int id)
    {
        var result = _assetService.GetByUserId(id);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }


}
