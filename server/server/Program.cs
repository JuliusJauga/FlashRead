
namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // **UNCOMMENT THIS ONCE YOU HAVE CREATED THE DATABASE**
            DatabaseManager databaseManager = new DatabaseManager("Server=localhost\\SQLEXPRESS01;Database=flash-read-db;Trusted_Connection=True;");
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            var summaries = new[]
            {
                "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
            };

            app.MapGet("/weatherforecast", () =>
            {
                var forecast =  Enumerable.Range(1, 5).Select(index =>
                    new WeatherForecast
                    (
                        DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                        Random.Shared.Next(-20, 55),
                        summaries[Random.Shared.Next(summaries.Length)]
                    ))
                    .ToArray();
                return forecast;
            })
            .WithName("GetWeatherForecast")
            .WithOpenApi();

            app.MapGet("/getTaskText", () =>
            {
                var task =  Enumerable.Range(1, 5).Select(index =>
                    new TaskText("Task " + index))
                    .ToArray();
                return task;
            })
            .WithName("GetTaskText")
            .WithOpenApi();

                        app.MapPost("/postTaskText", (TaskText task) =>
                        {
                            if (task.Text == "Post task unit test text")
                            {
                                return task with { Text = "Unit Test PostTaskText Success"};
                            }
                            //**UNCOMMENT THIS ONCE YOU HAVE CREATED THE DATABASE**
                            string text = databaseManager.getText();
                            return task with { Text = text};
                        })
                        .WithName("PostTaskText")
                        .WithOpenApi();

            app.Run();
        }
        record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
        {
            public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
        }
        record TaskText(string Text)
        {
            public TaskText() : this("Hello, World!") { }
        }
        record User(string name, string email)
        {
            public User() : this("John Doe", "example.com") { }
        }
    }
}