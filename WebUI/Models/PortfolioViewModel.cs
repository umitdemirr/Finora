using Entities.Concrete;
using Entities.DTOs;

namespace WebUI.Models;

public class PortfolioViewModel
{
    public Portfolio? Portfolio { get; set; }
    public List<Portfolio>? PortfolioList { get; set; }
    public Result<List<PortfolioDetailDto>>? PortfolioDetails { get; set; }
}
