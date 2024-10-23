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
        public DbSet<DbTaskHistory> UserTaskHistories { get; set; }
        public DbSet<DbTask1Contribution> UserTask1Contributions { get; set; }
        public DbSet<DbUserSettings> UserSettings { get; set; } 
        public DbSet<DbSettingsTheme> SettingsThemes { get; set; }
        public DbSet<DbSettingsFont> SettingsFonts { get; set; }
        public DbSet<DbUserSessions> UserSessions { get; set; }
        public DbSet<DbUserSingleSession> UserSingleSessions { get; set; }
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
                entity.Property(e => e.JoinedAt).HasColumnName("joined_at");
                entity.Property(e => e.SessionsId).HasColumnName("sessions_id");
            });
            modelBuilder.Entity<DbUserSessions>(entity => {
                entity.ToTable("user_sessions", "users");
                entity.HasKey(e => e.Id).HasName("user_sessions_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.SessionIds).HasColumnName("session_ids");
            });
            modelBuilder.Entity<DbUserSingleSession>(entity => {
                entity.ToTable("single_session", "users");
                entity.HasKey(e => e.Id).HasName("single_session_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.TimeStarted).HasColumnName("time_started");
                entity.Property(e => e.TimeEnded).HasColumnName("time_ended");
            });
            modelBuilder.Entity<DbTaskHistory>(entity => {
                entity.ToTable("user_history", "users");
                entity.HasKey(e => e.Id).HasName("history_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.SessionId).HasColumnName("session_id");
                entity.Property(e => e.TaskId).HasColumnName("task_id");
                entity.Property(e => e.Answers).HasColumnName("answers");
                entity.Property(e => e.TimePlayed).HasColumnName("time_played");
            });
            modelBuilder.Entity<DbTask1Contribution>(entity => {
                entity.ToTable("contributions", "users");
                entity.HasKey(e => e.Id).HasName("contributions_pkey");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.QuestionsId).HasColumnName("questions_id");
            });
        }
    }
}