using server.src;
using Microsoft.EntityFrameworkCore;
using server.src.Task1;
using Npgsql;
using server.UserNamespace;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Net.NetworkInformation;
using Microsoft.IdentityModel.Tokens;
using System.Text;
namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(options => {
                options.AddPolicy(
                    name: MyAllowSpecificOrigins, 
                    policy  => {policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();}
                );
            });

            while (true) {
                try
                {
                    var dataSourceBuilder = new NpgsqlDataSourceBuilder(ConnectionStringBuilder.BuildConnectionString());
                    dataSourceBuilder.MapEnum<Task1.Theme>();
                    var dataSource = dataSourceBuilder.Build();
                    builder.Services.AddDbContext<FlashDbContext>(options => options.UseNpgsql(dataSource));
                    
                    // Test the connection
                    using (var connection = dataSource.CreateConnection())
                    {
                        connection.Open();
                        Console.WriteLine("Database connection successful.");
                    }
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Database connection failed: {ex.Message}");
                }
            }
            
            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new InvalidOperationException("JWT_SECRET environment variable is not set!"))),
                        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                        ValidAudience = builder.Configuration["JwtSettings:Audience"],
                        ClockSkew = TimeSpan.Zero
                    };
                });

            builder.Services.AddSingleton<TokenProvider>();

            builder.Services.AddScoped<UserHandler>();
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGenWithAuth();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors(MyAllowSpecificOrigins);
            
            app.UseHsts();

            app.MapControllers();

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.Run();
        }
    }
}