using System.Security.Cryptography;
using server.src;
using server.src.Task1;
using server.src.Task2;

namespace server {
    public record TaskRequest {
        public int TaskId { get; set; }
        public bool? Collision { get; set; }
        public int? CurrentPoints { get; set; }
        public string? CollectedWord { get; set; }
        public string? Theme { get; set; }
        public string? Difficulty { get; set; }
    }
    public interface ITaskResponse {
        public uint Session { get; set; }
    }
    public record TaskAnswerRequest {
        public uint Session { get; set; }
        public int[]? SelectedVariants { get; set; }
        public int? TimeTaken { get; set; }
    }
    public interface ITaskAnswerResponse {}
    public interface ITask {
        public static uint GenerateSessionBase(int TaskId) {
            uint rand = (uint)RandomNumberGenerator.GetInt32(int.MaxValue) & ~(0b11U << 30); // clear first 2 bits for task id
            return rand | ((uint)TaskId << 30);
        }
        public static int GetTaskIdFromSession(uint session) {
            return (int)(session >> 30);
        }
        public static ITask GetTaskFromTaskId(int taskId, FlashDbContext context) {
            return taskId switch {
                1 => new Task1(context),
                2 => new Task2(context),
                3 => new Task2Data(context),
                _ => throw new System.Exception("Task not found"),// TODO: throw custom exception
            };
        }
        public ITaskResponse GetResponse(TaskRequest request);
        public ITaskAnswerResponse CheckAnswer(TaskAnswerRequest request);
    }
}