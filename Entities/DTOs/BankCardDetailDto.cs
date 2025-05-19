using Core.Entities;

namespace Entities.DTOs
{
    public class BankCardDetailDto : IDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int BankId { get; set; }
        public string BankName { get; set; }
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public string CardType { get; set; }
        public string Provider { get; set; }
        public string CardName { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
        public decimal CardLimit { get; set; }
        public decimal AvaliableCardLimit { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }

    }
}
