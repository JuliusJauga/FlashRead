namespace server {
    public class Task1 : ITask {
        public ITaskResponse GetResponse(TaskRequest request) {
            TaskResponse resp = new() {
                Text = "lorem ipsum testing ipsum",
                Questions = [
                    new() {Question = "Question 1", Variants = ["fox", "horse", "eagle"]},
                    new() {Question = "Question 2", Variants = ["ice", "fire", "rock"]},
                    new() {Question = "Question 3", Variants = ["lorem", "ipsum"]}
                ]
            };
            return resp;
        }
    }
    public record TaskResponse : ITaskResponse {
        public required string Text { get; set; }
        public required RQuestion[] Questions { get; set; }
    }
    public record RQuestion {
        public required string Question {get; set;}
        public required string[] Variants {get; set;}
    } 
}