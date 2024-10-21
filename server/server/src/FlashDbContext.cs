using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using server.src.Task1;
using server.src.Task2;
using server.UserNamespace;
using server.src.Settings;
namespace server.src {
    public class FlashDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public DbSet<DbTask1Text> Task1Texts { get; set; }
        public DbSet<DbTask1Question> Task1Questions { get; set; }
        public DbSet<DbUser> Users { get; set; }
        public DbSet<DbTask2Text> Task2Texts { get; set; }
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
                entity.ToTable("users", "users");
                entity.HasKey(e => e.Email).HasName("users_pkey");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.HistoryIds).HasColumnName("history_ids");
                entity.Property(e => e.ContributionsIds).HasColumnName("contributions_ids");
                entity.Property(e => e.SettingsId).HasColumnName("settings_id");
            });
            modelBuilder.Entity<DbTask1History>(entity => {
                entity.ToTable("history", "users");
                entity.HasKey(e => e.Id).HasName("history_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.QuestionsId).HasColumnName("questions_id");
                entity.Property(e => e.Answers).HasColumnName("answers");
            });
            modelBuilder.Entity<DbTask1Contribution>(entity => {
                entity.ToTable("contributions", "users");
                entity.HasKey(e => e.Id).HasName("contributions_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.QuestionsId).HasColumnName("questions_id");
            });
            modelBuilder.HasPostgresEnum<Task2.Task2Data.Theme>(schema: "task2", name: "theme");
            modelBuilder.Entity<DbTask2Text>(entity => {
                entity.ToTable("texts", "task2");
                entity.HasKey(e => e.Id).HasName("texts_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Theme).HasColumnName("theme");
                entity.Property(e => e.Text).HasColumnName("text");
            });
            
            modelBuilder.Entity<DbUserSettings>(entity => {
                entity.ToTable("settings", "users");
                entity.HasKey(e => e.Id).HasName("settings_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Theme).HasColumnName("theme");
            });
            modelBuilder.Entity<DbSettingsTheme>(entity => {
                entity.ToTable("theme", "settings");
                entity.HasKey(e => e.Theme).HasName("theme_pkey");
                entity.Property(e => e.Theme).HasColumnName("theme");
                entity.Property(e => e.MainBackground).HasColumnName("main_background");
                entity.Property(e => e.SecondaryBackground).HasColumnName("secondary_background");
                entity.Property(e => e.PrimaryColor).HasColumnName("primary_color");
                entity.Property(e => e.AccentColor).HasColumnName("accent_color");
                entity.Property(e => e.TextColor).HasColumnName("text_color");
                entity.Property(e => e.BorderColor).HasColumnName("border_color");
            });
        }
    }
}