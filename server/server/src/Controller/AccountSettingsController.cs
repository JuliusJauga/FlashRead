using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
using System.Security.Claims;
using server.Models;

namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class AccountSettingsController : ControllerBase {
        private readonly UserHandler _userHandler;
        public AccountSettingsController(UserHandler userHandler) {
            _userHandler = userHandler;
        }
        // TO DO When settings added

        

        [HttpPost("GetSettings")]
        public ActionResult<Settings> GetSettings() {
            return Ok("");
        }

        [HttpPost("UpdateSettings")]
        public ActionResult UpdateSettings([FromBody] Settings settings) {
            _settings.Theme = settings.Theme;
            _settings.Font = settings.Font;
            return NoContent();
        }   
    }
}