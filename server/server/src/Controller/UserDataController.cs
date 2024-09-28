using Microsoft.AspNetCore.Mvc;

namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class UserDataController : ControllerBase {
        [HttpPost("GetTask")]
        public ITaskResponse PostGetTask(TaskRequest req) {
            ITask task = ITask.GetTaskFromTaskId(req.TaskId);
            return task.GetResponse(req);
        }
        [HttpPost("GetTaskAnswer")]
        public ITaskAnswerResponse PostGetTaskAnswer(TaskAnswerRequest req) {
            int taskId = ITask.GetTaskIdFromSession(req.Session);
            ITask task = ITask.GetTaskFromTaskId(taskId);
            return task.CheckAnswer(req);
        }
    }
}