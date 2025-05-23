﻿using Business.Abstract;
using Core.Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    } 
    
    [HttpGet("getall")]
    public IActionResult Get()
    {
        var result = _userService.GetAll();
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpGet("getdetail")]
    public IActionResult GetCardDetail(int userId)
    {
        var result = _userService.GetAllUserDetailByUserId(userId);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }

    [HttpPost("add")]
    public IActionResult Add(User user)
    {
        var result = _userService.Add(user);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
    
    [HttpPost("update")]
    public IActionResult Update(User user)
    {
        var result = _userService.Update(user);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
    
    [HttpPost("delete")]
    public IActionResult Delete(User user)
    {
        var result = _userService.Delete(user);
        if (result.Success)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
}