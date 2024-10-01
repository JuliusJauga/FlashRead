using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class UserDataController : ControllerBase {
        private readonly IUserHandler _userHandler;
        private readonly FlashDbContext _context;
        public UserDataController(FlashDbContext context, IUserHandler userHandler) {
            _context = context;
            _userHandler = userHandler;
        }
        
        [HttpPost("GetTask")]
        public ITaskResponse PostGetTask(TaskRequest req) {
            ITask task = ITask.GetTaskFromTaskId(req.TaskId, _context);
            return task.GetResponse(req);
        }
        [HttpPost("GetTaskAnswer")]
        public ITaskAnswerResponse PostGetTaskAnswer(TaskAnswerRequest req) {
            int taskId = ITask.GetTaskIdFromSession(req.Session);
            ITask task = ITask.GetTaskFromTaskId(taskId, _context);
            return task.CheckAnswer(req);
        }

        [HttpPost("Users/Register")]
        public async Task<IActionResult> PostUser([FromBody] User user) {
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