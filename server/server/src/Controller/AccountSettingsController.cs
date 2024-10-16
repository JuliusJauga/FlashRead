using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.src;
using server.UserNamespace;
using System.Security.Claims;
namespace server.Controller {
    [Route("api")]

    [ApiController]
    public class AccountSettingsController : ControllerBase {
        private readonly UserHandler _userHandler;
        public AccountSettingsController(UserHandler userHandler) {
            _userHandler = userHandler;
        }
        // TO DO When settings added
    }
}