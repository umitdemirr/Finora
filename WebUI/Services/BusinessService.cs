using Core.Entities;
using Core.Entities.Concrete;
using Newtonsoft.Json;
using System.Text;
using WebUI.Models;
namespace WebUI.Services;

public class BusinessService
{
    private readonly HttpClient _httpClient;
    private readonly TokenService _tokenService;

    public BusinessService(TokenService tokenService, HttpClient httpClient)
    {
        _tokenService = tokenService;
        _httpClient = httpClient;
    }

    public async Task PostAsync<T>(T entity, string url)
    {
        _tokenService.SetAuthorizationHeader();
        var json = JsonConvert.SerializeObject(entity);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(url, content);
        var responseString = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"API Hatası: {response.StatusCode} - {responseString}");
        }
    }

    public async Task<Result<T>> Get<T>(string url, T entity)
    {
        var response = await _httpClient.GetAsync(url);
        var json = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<Result<T>>(json);
        return result;
    }

    public async Task<Result<List<T>>> GetAll<T>(string url)
    {
        var response = await _httpClient.GetAsync(url);
        var json =  await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<Result<List<T>>>(json);
        return result;
    }

    public async Task<Result<List<T>>> GetByUserId<T>(string url)
    {
        int userId = _tokenService.GetTokenInfo();
        string queryParam = $"?userId={userId}";
        var result = await GetAll<T>(url+queryParam);
        return result;
    }

    public async Task<Result<List<T>>> GetFiltered<T>(string url, Func<T, bool> predicate)
    {
        var result = await GetAll<T>(url);
        result.Data = result.Data?.Where(predicate).ToList();
        return result;
    }

    public async Task<AiViewModel> GenerateWithAI(AiViewModel model, string url)
    {
        var json = JsonConvert.SerializeObject(model);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(url, content);
        var responseString = await response.Content.ReadAsStringAsync();

        var result = JsonConvert.DeserializeObject<AiViewModel>(responseString);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"API Hatası: {response.StatusCode} - {responseString}");
        }

        model.Answer = result.Answer;

        return model;
    }
    public async Task<AiModelWithEntity<T>> AnalysisWithAI<T>(AiModelWithEntity<T> model)
    {
        var json = JsonConvert.SerializeObject(model);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(model.Url, content);
        var responseString = await response.Content.ReadAsStringAsync();

        var result = JsonConvert.DeserializeObject<AiViewModel>(responseString);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"API Hatası: {response.StatusCode} - {responseString}");
        }

        model.Answer = result.Answer;

        return model;
    }
}
