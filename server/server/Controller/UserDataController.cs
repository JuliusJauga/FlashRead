using Microsoft.AspNetCore.Mvc;

namespace server.Controller
{
    [Route("api/[controller]")]

    [ApiController]
    public class UserDataController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<TaskText> GetTaskText()
        {
            var tasks = Enumerable.Range(1, 5).Select(index => new TaskText($"Task {index}")).ToArray();
            return tasks;
        }
    }
    public record TaskText(string Text)
    {
        public TaskText() : this("Hello, World!") { }
    }
}