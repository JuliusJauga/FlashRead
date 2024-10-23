using server.src;
using server.UserNamespace;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Threading.Tasks;
namespace server.Services {
    public class SessionManager
    {
        private readonly ConcurrentDictionary<string, UserSession> _sessions = new ConcurrentDictionary<string, UserSession>();
        private readonly DbContextFactory _dbContextFactory;
        public SessionManager(DbContextFactory dbContextFactory) {
            _dbContextFactory = dbContextFactory;
        }
        public async Task CreateSessionsTable(string email) {
            using (var _context = _dbContextFactory.GetDbContext()) {
                var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (dbUser == null)
                {
                    return;
                }
                var sessionContainer = new DbUserSessions
                {
                    Id = Guid.NewGuid().ToString(),
                    SessionIds = new string[0]
                };
                _context.UserSessions.Add(sessionContainer);
                dbUser.SessionsId = sessionContainer.Id;
                _context.Users.Update(dbUser);
                await _context.SaveChangesAsync();
            }
        }
        public async Task SaveUserSession(string email, UserSession session) {
            using (var _context = _dbContextFactory.GetDbContext()) {
                var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (dbUser == null)
                {
                    return;
                }
                var sessionContainer = await _context.UserSessions.FirstOrDefaultAsync(s => s.Id == dbUser.SessionsId);
                if (sessionContainer == null)
                {
                    return;
                }
                var dbUserSingleSession = new DbUserSingleSession
                {
                    Id = Guid.NewGuid().ToString(),
                    TimeStarted = session.SessionStart,
                    TimeEnded = session.LatestTimeAlive
                };
                _context.UserSingleSessions.Add(dbUserSingleSession);
                sessionContainer.SessionIds = sessionContainer.SessionIds.Append(dbUserSingleSession.Id).ToArray();
                _context.UserSessions.Update(sessionContainer);
                await _context.SaveChangesAsync();
            }
        }
        public async Task AddSessionToDictionary(string email) {
            using (var _context = _dbContextFactory.GetDbContext()) {
                var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (dbUser == null)
                {
                    return;
                }
                var session = new UserSession
                {
                    SessionStart = DateTime.UtcNow,
                    LatestTimeAlive = DateTime.UtcNow
                };
                _sessions.TryAdd(email, session);
            }
        }
        public async Task HealthCheck() {
            foreach (var session in _sessions)
            {
                if (DateTime.UtcNow - session.Value.LatestTimeAlive > TimeSpan.FromMinutes(2))
                {
                    await SaveUserSession(session.Key, session.Value);
                    _sessions.TryRemove(session.Key, out _);
                }
            }
        }
        public void UpdateSession(string email) {
            if (_sessions.TryGetValue(email, out var session))
            {
                session.LatestTimeAlive = DateTime.UtcNow;
                _sessions[email] = session;
            }
        }
        public List<string> GetConnectedUsers() {
            var connectedUsers = new List<string>();
            foreach (var session in _sessions)
            {
                connectedUsers.Add(session.Key);
            }
            return connectedUsers;
        }
        public class UserSession {
            public DateTime SessionStart { get; set; }
            public DateTime LatestTimeAlive { get; set; }
        }
    }
}