using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
using System.Security.Claims;
namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class TaskController : ControllerBase {
        private readonly FlashDbContext _context;
        private readonly UserHandler _userHandler;
        public TaskController(FlashDbContext context, UserHandler userHandler) {
            _context = context;
            _userHandler = userHandler;
        }
        [HttpPost("GetTask")]
        public ITaskResponse PostGetTask(TaskRequest req) {
            ITask task = ITask.GetTaskFromTaskId(req.TaskId, _context);
            return task.GetResponse(req);
        }
        [HttpPost("GetTaskAnswer")]
        public async Task<ITaskAnswerResponse> PostGetTaskAnswer(TaskAnswerRequest req) {
            int taskId = ITask.GetTaskIdFromSession(req.Session);
            ITask task = ITask.GetTaskFromTaskId(taskId, _context);
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail) == false)
            {
                if (req.SelectedVariants != null)
                {
                    await _userHandler.SaveTaskResult(userEmail, req.Session, taskId, req.SelectedVariants);
                }
            }
            return task.CheckAnswer(req);
        }
    }
}