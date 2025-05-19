using Core.Entities;

namespace Entities.DTOs;

public class UserDetailDto : IDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Mail { get; set; }
}