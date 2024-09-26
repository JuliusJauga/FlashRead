using Microsoft.AspNetCore.Mvc;

namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class UserDataController : ControllerBase {
        private readonly IUserHandler _userHandler;
        public UserDataController(IUserHandler userHandler)
        {
            _userHandler = userHandler;
        }
        [HttpPost("GetTask")]
        public ITaskResponse PostGetTask(TaskRequest req) {
            ITask task = req.TaskId switch
            {
                1 => new Task1(),
                _ => throw new System.Exception("Task not found"),// TODO: throw custom exception
            };
            return task.GetResponse(req);
        }
        [HttpPost("PostUser")]
        [RequireHttps]
        [HttpPost]
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
}