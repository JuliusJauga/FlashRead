using Microsoft.AspNetCore.Mvc;

namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class UserDataController : ControllerBase {
        [HttpPost("GetTask")]
        public ITaskResponse PostGetTask(TaskRequest req) {
            ITask task = req.TaskId switch
            {
                1 => new Task1(),
                _ => throw new System.Exception("Task not found"),// TODO: throw custom exception
            };
            return task.GetResponse(req);
        }
    }
}