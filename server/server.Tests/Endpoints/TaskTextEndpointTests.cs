using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using Newtonsoft.Json.Linq;
using server; // Ensure this matches the namespace of your Program class

namespace server.Tests.Endpoints
{
    public class TaskTextEndpointTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public TaskTextEndpointTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task PostTaskText_ReturnsSuccessStatusCode()
        {
            // Arrange
            var client = _factory.CreateClient();
            var content = new StringContent("{\"text\": \"Post task unit test text\"}", Encoding.UTF8, "application/json");

            // Act
            var response = await client.PostAsync("http://localhost:5076/postTaskText", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonResponse = JObject.Parse(responseContent);
            jsonResponse["text"]?.ToString().Should().Be("Unit Test PostTaskText Success");
        }
    }
}