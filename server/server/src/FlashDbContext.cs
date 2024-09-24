using Microsoft.EntityFrameworkCore;

namespace server.src {
    public class FlashDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public DbSet<User> Users { get; set; }
        public FlashDbContext(DbContextOptions<FlashDbContext> options) : base(options) { }
    }
}