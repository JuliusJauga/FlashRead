using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using server.src.Task1;
using server.UserNamespace;
namespace server.src {
    public class FlashDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public DbSet<DbTask1Text> Task1Texts { get; set; }
        public DbSet<DbTask1Question> Task1Questions { get; set; }
        public DbSet<DbUser> Users { get; set; }
        public FlashDbContext(DbContextOptions<FlashDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.HasPostgresEnum<Task1.Task1.Theme>(schema: "task1", name: "theme");
            modelBuilder.Entity<DbTask1Text>(entity => {
                entity.ToTable("texts", "task1");
                entity.HasKey(e => e.Id).HasName("texts_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Theme).HasColumnName("theme");
                entity.Property(e => e.Text).HasColumnName("text");
            });
            modelBuilder.Entity<DbTask1Question>(entity => {
                entity.ToTable("questions", "task1");
                entity.HasKey(e => e.Id).HasName("questions_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.TextId).HasColumnName("text_id");
                entity.Property(e => e.Question).HasColumnName("question");
                entity.Property(e => e.Variants).HasColumnName("variants");
                entity.Property(e => e.AnswerId).HasColumnName("answer_id");
            });
            modelBuilder.Entity<DbUser>(entity => {
                entity.ToTable("users", "public");
                entity.HasKey(e => e.Id).HasName("users_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Password).HasColumnName("password");
            });
        }
    }
}