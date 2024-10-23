using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
using System.Security.Claims;
using server.Services;
namespace server.Controllers {
    [Route("api")]
    [ApiController]
    public class HealthCheckController : ControllerBase {
        private readonly SessionManager _sessionManager;
        public HealthCheckController(SessionManager sessionManager) {
            _sessionManager = sessionManager;
        }
        [Authorize]
        [HttpPost("Session/Update")]
        public IActionResult StartHealthCheck() {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email)) {
                return Unauthorized("Invalid token.");
            }
            _sessionManager.UpdateSession(email);
            return Ok("Health check passed");
        }
        [HttpGet("Session/GetConnectedUsers")]
        public IActionResult Get() {
            var connectedUsers = _sessionManager.GetConnectedUsers();
            return Ok(connectedUsers);
        }
    }
}