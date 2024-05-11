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
List<Brewing> specialGlobalArray = new List<Brewing>();
var isBrewing = false; // Global variable to track brewing status
Brewing currentBrewing = null; // Global variable to store current brewing process
var lastUpdate = DateTime.Now;

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
            Console.WriteLine("Status endpoint called.");
            var statusDto = new EquipmentStatusDto
            {
                Temperature = 25.5,
                Pressure = 1013.25,
                Humidity = 50,
                Fullness = 0.75,
                LastUpdate = lastUpdate.ToString(),
                IsBrewing = isBrewing
            };
            responseString = JsonSerializer.Serialize(statusDto);
            break;

        case "/startbrewing":
            Console.WriteLine("Start Brewing endpoint called.");
            if (!isBrewing)
            {
                using (var reader = new StreamReader(request.InputStream))
                {
                    var requestBody = await reader.ReadToEndAsync();
                    var recipe = JsonSerializer.Deserialize<Recipe>(requestBody); // Deserialize into Recipe object
                    Console.WriteLine($"Starting brewing for recipe: {recipe.Title}"); // Log the recipe being brewed
                    isBrewing = true; // Set brewing status to true
                    lastUpdate = DateTime.Now;
                    currentBrewing = new Brewing
                    {
                        Id = Guid.NewGuid(),
                        RecipeId = recipe.Id,
                        BrewingLogs = new List<BrewingLog>(),
                        Status = Status.Started,
                        CreatedAt = lastUpdate
                    };
                    currentBrewing = new Brewing
                    {
                        Id = Guid.NewGuid(),
                        RecipeId = recipe.Id,
                        BrewingLogs = new List<BrewingLog>(),
                        Status = Status.Started,
                        CreatedAt = lastUpdate
                    };
                    var brewingDto = new BrewingFullInfoDto
                    (
                        currentBrewing.Id,
                        Enum.GetName(typeof(Status), currentBrewing.Status),
                        currentBrewing.BrewingLogs.Select(b => b.LogTime).LastOrDefault().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss"),
                        currentBrewing.BrewingLogs.Select(bL => new BrewingLogDto(bL.Message, bL.LogTime)).ToList()

                    );
                    responseString = JsonSerializer.Serialize(brewingDto);

                    foreach (var ingredient in recipe.Ingredients)
                    {
                        var addingMessage = $"Adding {ingredient.Name}";
                        Console.WriteLine(addingMessage); // Log the adding message to the console
                        currentBrewing.BrewingLogs.Add(new BrewingLog { StatusCode = BrewingLogCode.Info, Message = addingMessage });
                        await Task.Delay(3000); // Wait for 3 seconds
                    }

                    var brewingMessage = "Brewing the beer";
                    Console.WriteLine(brewingMessage);
                    currentBrewing.BrewingLogs.Add(new BrewingLog { StatusCode = BrewingLogCode.Info, Message = brewingMessage });

                }
            }
            else
            {
                responseString = "Another brewing process is already in progress.";
            }
            break;



        case "/brewingstatus":
            Console.WriteLine("Brewing Status endpoint called.");
            if (isBrewing && currentBrewing != null)
            {
                var brewingStatusDto = new BrewingFullInfoDto
                (
                    currentBrewing.Id,
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
            Console.WriteLine("Abort endpoint called.");
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
