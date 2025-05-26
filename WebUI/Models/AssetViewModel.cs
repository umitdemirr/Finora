using Entities.Concrete;

namespace WebUI.Models;

public class AssetViewModel
{
    public Result<List<Asset>> MyAssets { get; set; }
}
