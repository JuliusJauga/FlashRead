using System;
using System.IO;
using Newtonsoft.Json.Linq;

namespace server
{
    public static class ConnectionStringBuilder
    {
        public static string BuildConnectionString()
        {
            string configPath = "config.json";
            string password = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? throw new InvalidOperationException("Environment variable DB_PASSWORD is not set.");

            if (!File.Exists(configPath))
            {
                throw new FileNotFoundException($"Configuration file not found: {configPath}");
            }

            string host, port, database, username;

            using (var stream = new FileStream(configPath, FileMode.Open, FileAccess.Read))
            using (var reader = new StreamReader(stream))
            {
                var configJson = JObject.Parse(reader.ReadToEnd());
                host = configJson["DB_HOST"]?.ToString() ?? string.Empty;
                port = configJson["DB_PORT"]?.ToString() ?? string.Empty;
                database = configJson["DB_NAME"]?.ToString() ?? string.Empty;
                username = configJson["DB_USER"]?.ToString() ?? string.Empty;
            }

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(port) || string.IsNullOrEmpty(database) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                throw new InvalidOperationException("Configuration is incomplete.");
            }

            return $"Host={host};Port={port};Database={database};Username={username};Password={password};";
        }
    }
}