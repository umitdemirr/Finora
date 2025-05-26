using AiBridge.Core;
using AiBridge.Enums;
using AiBridge.Models;
using AiBridge.Utils;
using Business.Abstract;
using Core.Entities;

namespace Business.Concrete;

public class AiManager : IAiService
{
    //string geminiKey = "AIzaSyBTRhZOPny-JCtWt9I0jVNBvSHfEBLsKIg";
    //string model = "gemini-2.0-flash";

    public async Task<ChatResponse> PromptWithEntityAsync<T>(string apiKey, string model, T entity, string promptFor)
    {
        string prompt = promptFor switch
        {
            "Invest" => InvestPrompt(entity),
            "Budget" => BudgetPrompt(entity),
            _ => throw new ArgumentException("Geçersiz prompt türü: " + promptFor)
        };

        var service = new AiBridgeService(apiKey, model);
        var request = new ChatRequest { Messages = new() { new ChatMessage { Role = "user", Content = prompt } } };
        var response = await service.ChatAsync(request, ProviderType.Gemini);

        return response;
    }

    public async Task<ChatResponse> SimplePromptAsync(string model, string apiKey, string prompt)
    {
        var service = new AiBridgeService(apiKey, model);
        var request = new ChatRequest { Messages = new() { new ChatMessage { Role = "user", Content = prompt } } };
        var response = await service.ChatAsync(request, ProviderType.Gemini);

        return response;
    }

    private string InvestPrompt<T>(T entity)
    {
        var prompt = PromptBuilder.Create()
                .WithSystemRole("Sen deneyimli bir finansal danışmansın. Portföy verilerini, ekonomik göstergeleri ve geçmiş performansı değerlendirerek yatırımcıya stratejik ve kişiselleştirilmiş öneriler sunmalısın. Analizlerinde karşılaştırmalar, grafik önerileri ve dilde açıklık ön planda olmalı.")
                .WithContextFromEntity(entity, @"
                    Yatırımcının portföy detayları aşağıdadır. Varlık dağılımı, gerçekleşmiş alış-satış işlemleri ve mevcut kar/zarar durumu verilmiştir. 
                    Lütfen bu verilere göre:

                    1. Portföyün güçlü ve zayıf yönlerini değerlendir.
                    2. Kar/zarar oranı üzerinden yatırımcının performansını yorumla.
                    3. Altın ve enflasyon karşılaştırması yaparak portföyün reel getirisine dair çıkarımda bulun.
                    4. Uygun görsellikte (örneğin: varlık dağılımı pasta grafiği, kar/zarar trend çizgisi) grafik önerileri sun.
                    5. Yatırımcının hedeflerine ulaşması için stratejik önerilerde bulun (örneğin çeşitlendirme, risk azaltma, yeniden dengeleme).

                    Analiz dilin açık, veri temelli ve yapıcı olsun. 
                    İstatistiksel oranlar, trend yorumları ve benzer portföy kıyaslamaları gibi öğeleri de ekleyebilirsin.
                    ")
                        .WithUserMessage("Portföyümü değerlendirmeni istiyorum. Güçlü ve zayıf yönlerini belirt, kar/zarar oranıma yorum yap, altın ve enflasyon karşılaştırmasıyla reel getirimi analiz et. Ayrıca görsel olarak grafiklerle desteklersen çok iyi olur.")
                        .BuildAsSingleTextPrompt();

        return prompt;
    }
    private string BudgetPrompt<T>(T entity)
    {
        var prompt = PromptBuilder.Create()
                    .WithSystemRole("Sen deneyimli bir kişisel finans danışmanısın. Kullanıcının harcama, gelir ve bütçe verilerini analiz ederek finansal durumunu değerlendirir ve bütçesini daha sağlıklı yönetmesi için stratejik öneriler sunarsın. Yorumlarında grafik önerileri, kategorik analizler ve ekonomik bilinç ön planda olmalı.")
                    .WithContextFromEntity(entity, @"
                        Aşağıda yatırımcının/kullanıcının kişisel bütçesiyle ilgili veriler yer almaktadır:
                        - Tüm banka ve kredi kartı hesap hareketleri
                        - Aylık gelirler ve giderler
                        - Harcama kategorileri (gıda, ulaşım, kira, sağlık, eğlence vb.)
                        - Dönemsel nakit akışı ve bakiye değişimleri

                        Lütfen bu verilere göre:

                        1. Kullanıcının genel bütçe performansını değerlendir.
                        2. En yüksek harcama yapılan kategorileri belirle ve oransal karşılaştırma yap.
                        3. Gelir-gider farkı üzerinden tasarruf oranını hesapla ve sürdürülebilirliğini yorumla.
                        4. Giderlerin artış/azalış trendini analiz ederek kullanıcıyı potansiyel risklere karşı uyar.
                        5. Altın ve enflasyon gibi ekonomik göstergelere göre paranın alım gücünü değerlendir (reel tasarruf analizi).
                        6. Kullanıcıya finansal farkındalık kazandıracak görsellik öner (örneğin: harcama kategorileri pasta grafik, aylık nakit akışı çizgi grafik, gelir/gider bar grafiği).
                        7. Harcama alışkanlıklarına göre kişiye özel tavsiyeler ver (örneğin, ihtiyaç-taraflı bütçe yönetimi, kategorik limitler, otomatik tasarruf stratejileri).

                        Açıklamalar açık, sade ama ekonomik temelli olsun. Yorumlarında iyileştirme potansiyeline de dikkat çek.
                    ")
                    .WithUserMessage("Bütçemi değerlendirmeni istiyorum. Gelir-gider farkımı, en çok harcadığım alanları, tasarruf durumumu ve genel finansal sağlığımı yorumla. Altın ve enflasyonla kıyaslayarak paramın değerini analiz et ve bana bazı grafik önerileri sun.")
                    .BuildAsSingleTextPrompt();


        return prompt;
    }
}