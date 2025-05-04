﻿namespace WebUI.Models;

public class LoginViewModel
{
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Token { get; set; }
    public DateTime? Expiration { get; set; }
}