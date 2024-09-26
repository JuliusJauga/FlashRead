using server.src ;
using server.Controller;
using Xunit;
using Moq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace server.Tests;
public class UserDataControllerTests
{
    private readonly Mock<IUserHandler> _mockUserHandler;
    private readonly UserDataController _controller;

    public UserDataControllerTests()
    {
        _mockUserHandler = new Mock<IUserHandler>();
        _controller = new UserDataController(_mockUserHandler.Object);
    }

    [Fact]
    public async Task PostUser_InvalidModelState_ReturnsBadRequest()
    {
        // Arrange
        _controller.ModelState.AddModelError("Name", "Required");

        // Act
        var result = await _controller.PostUser(new User());

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid user data.", badRequestResult.Value);
    }

    [Fact]
    public async Task PostUser_ValidUser_ReturnsOk()
    {
        // Arrange
        var user = new User { };
        _mockUserHandler.Setup(handler => handler.RegisterUserAsync(user)).ReturnsAsync(true);

        // Act
        var result = await _controller.PostUser(user);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("User added successfully.", okResult.Value);
    }

    [Fact]
    public async Task PostUser_RegistrationFails_ReturnsStatusCode500()
    {
        // Arrange
        var user = new User { };
        _mockUserHandler.Setup(handler => handler.RegisterUserAsync(user)).ReturnsAsync(false);

        // Act
        var result = await _controller.PostUser(user);

        // Assert
        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, statusCodeResult.StatusCode);
        Assert.Equal("An error occurred while adding the user.", statusCodeResult.Value);
    }
    [Fact]
    public void PostGetTask_ValidTaskId_ReturnsTaskResponse()
    {
        // Arrange
        var request = new TaskRequest { TaskId = 1 };

        // Act
        var result = _controller.PostGetTask(request);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<TaskResponse>(result);
    }

    [Fact]
    public void PostGetTask_InvalidTaskId_ThrowsException()
    {
        // Arrange
        var request = new TaskRequest { TaskId = 999 };

        // Act & Assert
        var exception = Assert.Throws<System.Exception>(() => _controller.PostGetTask(request));
        Assert.Equal("Task not found", exception.Message);
    }
}