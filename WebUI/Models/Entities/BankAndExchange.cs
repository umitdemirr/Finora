namespace WebUI.Models.Entities
{
    public class BankAndExchange
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Country { get; set; }
        public bool IsActive { get; set; }
    }
}
