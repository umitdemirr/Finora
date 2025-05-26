using Business.Abstract;
using Core.Entities.Concrete;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("invest-analysis")]
        public async Task<IActionResult> InvestAnalysis(AiModelWithEntity<List<Asset>> model)
        {
            if (string.IsNullOrWhiteSpace(model.Model) || string.IsNullOrWhiteSpace(model.ApiKey) || model.Entity == null)
            {
                return BadRequest("parametre boş geçilemez");
            }

            var result = await _aiService.PromptWithEntityAsync(model.ApiKey, model.Model, model.Entity, model.PromptFor);
            return Ok(result);
        }

        [HttpPost("budget-analysis")]
        public async Task<IActionResult> BudgetAnalysis(AiModelWithEntity<List<BankTransaction>> model)
        {
            if (string.IsNullOrWhiteSpace(model.Model) || string.IsNullOrWhiteSpace(model.ApiKey) || model.Entity == null)
            {
                return BadRequest("parametre boş geçilemez");
            }

            var result = await _aiService.PromptWithEntityAsync(model.ApiKey, model.Model, model.Entity, model.PromptFor);
            return Ok(result);
        }
        [HttpPost("simple-prompt")]
        public async Task<IActionResult> SimplePrompt(AiModel entity)
        {
            if (string.IsNullOrWhiteSpace(entity.Prompt) || string.IsNullOrWhiteSpace(entity.ApiKey) || string.IsNullOrWhiteSpace(entity.Model))
            {
                return BadRequest("parametre boş geçilemez");
            }

            var result = await _aiService.SimplePromptAsync(entity.Model, entity.ApiKey, entity.Prompt);
            return Ok(result);
        }
    }
}
