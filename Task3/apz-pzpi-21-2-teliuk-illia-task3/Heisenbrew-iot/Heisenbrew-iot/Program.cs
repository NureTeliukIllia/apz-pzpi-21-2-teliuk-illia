using Heisenbrew_iot;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using System.Threading.Tasks;

static int GetAvailablePort()
{
    var listener = new TcpListener(IPAddress.Loopback, 0);
    listener.Start();
    var port = ((IPEndPoint)listener.LocalEndpoint).Port;
    listener.Stop();
    return port;
}

var isBrewing = false; // Global variable to track brewing status
Brewing currentBrewing = null; // Global variable to store current brewing process

var listener = new HttpListener();
var port = GetAvailablePort();
listener.Prefixes.Add($"http://localhost:{port}/");
listener.Start();
Console.WriteLine($"Server is running at http://localhost:{port}/");

while (true)
{
    var context = await listener.GetContextAsync();
    var request = context.Request;
    var response = context.Response;

    string responseString = "";

    switch (request.Url.LocalPath)
    {
        case "/status":
            var statusDto = new EquipmentStatusDto
            {
                Temperature = 25.5,
                Pressure = 1013.25,
                Humidity = 50,
                Fullness = 0.75,
                LastUpdate = DateTime.Now.ToString(),
                IsBrewing = isBrewing
            };
            responseString = JsonSerializer.Serialize(statusDto);
            break;

        case "/startbrewing":
            if (!isBrewing)
            {
                using (var reader = new StreamReader(request.InputStream))
                {
                    var requestBody = await reader.ReadToEndAsync();
                    var recipe = JsonSerializer.Deserialize<RecipeDto>(requestBody);
                    // Start brewing the recipe...
                    isBrewing = true; // Set brewing status to true
                    currentBrewing = new Brewing
                    {
                        RecipeId = recipe.Id,
                        BrewingLogs = new List<BrewingLog>(),
                        Status = Status.Processing,
                        CreatedAt = DateTime.Now
                    };
                    responseString = $"Started brewing: {recipe.Title}";
                }
            }
            else
            {
                responseString = "Another brewing process is already in progress.";
            }
            break;

        case "/brewingstatus":
            if (isBrewing && currentBrewing != null)
            {
                var brewingStatusDto = new BrewingFullInfoDto
                (
                    "Brewing Equipment",
                    "Sample Recipe",
                    currentBrewing.Status.ToString(),
                    currentBrewing.CreatedAt.ToString(),
                    currentBrewing.BrewingLogs.Select(bL => new BrewingLogDto(bL.Message, bL.LogTime)).ToList()
                );
                responseString = JsonSerializer.Serialize(brewingStatusDto);
            }
            else
            {
                responseString = "No brewing process currently active.";
            }
            break;

        case "/abort":
            if (isBrewing && currentBrewing != null)
            {
                // Abort the brewing process...
                isBrewing = false; // Set brewing status to false
                currentBrewing = null; // Reset current brewing process
                responseString = "Brewing process aborted.";
            }
            else
            {
                responseString = "No brewing process to abort.";
            }
            break;

        default:
            response.StatusCode = 404;
            responseString = "Endpoint not found.";
            break;
    }

    byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
    response.ContentLength64 = buffer.Length;
    await response.OutputStream.WriteAsync(buffer, 0, buffer.Length);
    response.Close();
}
