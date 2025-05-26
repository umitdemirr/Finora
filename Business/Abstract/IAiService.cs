using AiBridge.Models;

namespace Business.Abstract;

public interface IAiService
{
    Task<ChatResponse> PromptWithEntityAsync<T>(string apiKey, string model, T entity, string promptFor);
    Task<ChatResponse> SimplePromptAsync(string prompt, string apiKey, string model);
}
