using Microsoft.AspNetCore.Mvc;
using server.src;

namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class UserDataController : ControllerBase {
        private readonly FlashDbContext _context;

        public UserDataController(FlashDbContext context) {
            _context = context;
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
    }
}