using Microsoft.AspNetCore.Mvc;

namespace server.Controller
{
    [Route("api/[controller]")]

    [ApiController]

    public class UserDataController : ControllerBase
    {
        private readonly IUserHandler _userHandler;
        public UserDataController(IUserHandler userHandler)
        {
            _userHandler = userHandler;
        }
        [HttpGet]
        public IEnumerable<TaskText> GetTaskText()
        {
            var tasks = Enumerable.Range(1, 5).Select(index => new TaskText($"Task {index}")).ToArray();
            return tasks;
        }

        [HttpPost]
        [RequireHttps]
        public async Task<IActionResult> PostUser([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid user data.");
            }
            var result = await _userHandler.RegisterUserAsync(user);
            if (result)
            {
                return Ok("User added successfully.");
            }
            return StatusCode(500, "An error occurred while adding the user.");
        }

    }

    public record TaskText(string Text)
    {
        public TaskText() : this("Hello, World!") { }
    }
}