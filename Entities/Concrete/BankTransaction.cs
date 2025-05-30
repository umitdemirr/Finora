﻿using Core.Entities;

namespace Entities.Concrete;

public class BankTransaction : IEntity
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public int UserId { get; set; }
    public string? Category { get; set; }
    public string? TransactionType { get; set; }
    public string? PaymentType { get; set; }
    public decimal Amount { get; set; }
    public string? Currency { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
}