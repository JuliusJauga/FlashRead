namespace server {
    public record TaskRequest {
        public int TaskId { get; set; }
        public string? Theme { get; set; }
        public string? Dificulty { get; set; }
    }
    public interface ITaskResponse {}
    public interface ITask {
        ITaskResponse GetResponse(TaskRequest request);
    }
}