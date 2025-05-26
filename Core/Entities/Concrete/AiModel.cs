namespace Core.Entities.Concrete;

public class AiModel
{
    public string? Model { get; set; }
    public string? Url { get; set; }
    public string? ApiKey { get; set; }
    public string? Prompt { get; set; }
    public string? Answer { get; set; }
}

public class AiModelWithEntity<T>
{
    public string? Model { get; set; }
    public string? Url { get; set; }
    public string? PromptFor { get; set; }
    public string? ApiKey { get; set; }
    public T Entity { get; set; }
    public string? Answer { get; set; }
}