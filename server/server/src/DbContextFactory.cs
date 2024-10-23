using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using server.src;
namespace server.Services {
    public class DbContextFactory {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public DbContextFactory(IServiceScopeFactory serviceScopeFactory) {
            _serviceScopeFactory = serviceScopeFactory;
        }

        public FlashDbContext GetDbContext() {
            var scope = _serviceScopeFactory.CreateScope();
            return scope.ServiceProvider.GetRequiredService<FlashDbContext>();
        }
    }
}