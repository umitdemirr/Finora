namespace Entities.Concrete;
public class Asset
{
    public string? Sembol { get; set; }
    public string? Ad { get; set; }
    public string? AssetType { get; set; }
    public int AlinanAdet { get; set; }
    public decimal AlisToplam { get; set; }
    public int SatilanAdet { get; set; }
    public decimal SatisToplam { get; set; }
    public int KalanAdet { get; set; }
    public decimal OrtalamaAlis { get; set; }
    public decimal KarZarar { get; set; }
    public decimal KarZararYuzdesi { get; set; }
}
