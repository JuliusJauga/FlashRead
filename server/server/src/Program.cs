using server.src;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // **UNCOMMENT THIS ONCE YOU HAVE CREATED THE DATABASE**
            //DatabaseManager databaseManager = new DatabaseManager("Server=localhost\\SQLEXPRESS01;Database=flash-read-db;Trusted_Connection=True;");
            
            var builder = WebApplication.CreateBuilder(args);
            var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                policy  => {
                                    policy.AllowAnyOrigin()
                                            .AllowAnyMethod()
                                            .AllowAnyHeader();
                                    });
            });


            // Add services to the container.
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddDbContext<FlashDbContext>(options => 
                options.UseSqlServer("Server=localhost\\SQLEXPRESS01;Database=flash-read-db;Trusted_Connection=True;"));
            
            builder.Services.AddScoped<IUserHandler, UserHandler>();
            builder.Services.AddScoped<IDatabaseManager, DatabaseManager>();

            builder.Services.AddControllers();
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
            app.UseCors(MyAllowSpecificOrigins);
            
            app.UseHsts();

            app.MapControllers();

            app.Run();
        }
    
        record User(string name, string email)
        {
            public User() : this("John Doe", "example.com") { }
        }
    }
}