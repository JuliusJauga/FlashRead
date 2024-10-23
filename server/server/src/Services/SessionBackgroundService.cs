using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using server.Services;
namespace server.Services {
    public class SessionBackgroundService : BackgroundService
    {
        private readonly SessionManager _sessionManagerService;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

        public SessionBackgroundService(SessionManager sessionManagerService)
        {
            _sessionManagerService = sessionManagerService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await _sessionManagerService.HealthCheck();
                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}