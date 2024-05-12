using Heisenbrew_iot;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static int GetAvailablePort()
    {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        var port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        return port;
    }

    static async Task Main(string[] args)
    {
        var port = GetAvailablePort();
        var endpointThread = Task.Run(() => HandleEndpoints(port));
        var brewingThread = Task.Run(() => ManageBrewing());

        await Task.WhenAll(endpointThread, brewingThread);
    }

    static async Task HandleEndpoints(int port)
    {
        var listener = new HttpListener();
        listener.Prefixes.Add($"http://localhost:{port}/");
        listener.Start();
        Console.WriteLine($"Server is running at http://localhost:{port}/");

        while (true)
        {
            var context = await listener.GetContextAsync();
            _ = Task.Run(() => ProcessRequest(context)); // Process each request in a separate task
        }
    }

    static async Task ManageBrewing()
    {
        while (true)
        {
            if (isBrewing && currentBrewing != null)
            {
                currentBrewing.Status = Status.Started;
                lastUpdate = DateTime.Now;
                var startingMessage = $"Starting brewing the \"{currentBrewing.Recipe.Title}\"...";
                currentBrewing.BrewingLogs.Add(new BrewingLog { StatusCode = BrewingLogCode.Info, Message = startingMessage, LogTime = lastUpdate });
                Console.WriteLine($"Starting brewing for recipe: {currentBrewing.Recipe.Title}");
                await Task.Delay(2000);

                if (isBrewing)
                {
                    currentBrewing.Status = Status.Filling;
                    foreach (var ingredient in currentBrewing.Recipe.Ingredients)
                    {
                        if (isBrewing)
                        {
                            var addingMessage = $"Adding {ingredient.Name}...";
                            lastUpdate = DateTime.Now;
                            currentBrewing.BrewingLogs.Add(new BrewingLog { StatusCode = BrewingLogCode.Info, Message = addingMessage, LogTime = lastUpdate });
                            Console.WriteLine($"[{lastUpdate}] {BrewingLogCode.Info}: {addingMessage}");
                            await Task.Delay(3000);
                        }
                    }
                }
                if (isBrewing)
                {
                    currentBrewing.Status = Status.Processing;
                    lastUpdate = DateTime.Now;
                    var brewingMessage = "Brewing the beer...";
                    currentBrewing.BrewingLogs.Add(new BrewingLog { StatusCode = BrewingLogCode.Info, Message = brewingMessage, LogTime = lastUpdate });
                    Console.WriteLine($"[{lastUpdate}] {BrewingLogCode.Info}: {brewingMessage}");
                    await Task.Delay(15000);
                }
                if (isBrewing)
                {
                    currentBrewing.Status = Status.Finished;
                    lastUpdate = DateTime.Now;
                    var completedMessage = "The brewing process is completed.";
                    currentBrewing.BrewingLogs.Add(new BrewingLog { StatusCode = BrewingLogCode.Info, Message = completedMessage, LogTime = lastUpdate });

                    Console.WriteLine($"[{lastUpdate}] {BrewingLogCode.Info}: {completedMessage}");
                    brewingsHistory.Add(currentBrewing);
                    currentBrewing = null;
                    isBrewing = false;
                }



            }
            await Task.Delay(1000);
        }
    }

    static async Task ProcessRequest(HttpListenerContext context)
    {
        var request = context.Request;
        var response = context.Response;

        string responseString = "";

        switch (request.Url.LocalPath)
        {
            case "/status":
                lastUpdate = DateTime.Now;
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
                if (!isBrewing)
                {
                    using (var reader = new StreamReader(request.InputStream))
                    {
                        var requestBody = await reader.ReadToEndAsync();
                        var recipe = JsonSerializer.Deserialize<Recipe>(requestBody);
                        isBrewing = true;
                        lastUpdate = DateTime.Now;
                        currentBrewing = new Brewing
                        {
                            Id = Guid.NewGuid(),
                            RecipeId = recipe.Id,
                            Recipe = recipe,
                            BrewingLogs = new List<BrewingLog>(),
                            Status = Status.Started,
                            CreatedAt = lastUpdate
                        };
                        var brewingDto = new BrewingFullInfoDto
                        (
                        currentBrewing.Id,
                        currentBrewing.RecipeId,
                        Enum.GetName(typeof(Status), currentBrewing.Status),
                        currentBrewing.BrewingLogs.Select(b => b.LogTime).LastOrDefault().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss"),
                        currentBrewing.BrewingLogs.Select(bL => new BrewingLogDto(Enum.GetName(bL.StatusCode.GetType(), bL.StatusCode), bL.Message, bL.LogTime.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss"))).ToList(),
                        currentBrewing.CreatedAt.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss")
                        );
                        responseString = JsonSerializer.Serialize(brewingDto);
                    }
                }
                else
                {
                    responseString = "Another brewing process is already in progress.";
                }
                break;

            case "/brewingstatus":
                lastUpdate = DateTime.Now;
                if (isBrewing && currentBrewing != null)
                {
                    var brewingStatusDto = new BrewingFullInfoDto
                    (
                        currentBrewing.Id,
                        currentBrewing.RecipeId,
                        currentBrewing.Status.ToString(),
                        currentBrewing.CreatedAt.ToString(),
                        currentBrewing.BrewingLogs.Select(bL => new BrewingLogDto(Enum.GetName(bL.StatusCode.GetType(), bL.StatusCode), bL.Message, bL.LogTime.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss"))).ToList(),
                        currentBrewing.CreatedAt.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss")
                    );
                    responseString = JsonSerializer.Serialize(brewingStatusDto);
                }
                else
                {
                    var lastBrewing = brewingsHistory.Last();
                    var brewingStatusDto = new BrewingFullInfoDto
                    (
                        lastBrewing.Id,
                        lastBrewing.RecipeId,
                        lastBrewing.Status.ToString(),
                        lastBrewing.CreatedAt.ToString(),
                        lastBrewing.BrewingLogs.Select(bL => new BrewingLogDto(Enum.GetName(bL.StatusCode.GetType(), bL.StatusCode), bL.Message, bL.LogTime.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss"))).ToList(),
                        lastBrewing.CreatedAt.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss")
                    );
                    responseString = JsonSerializer.Serialize(brewingStatusDto);
                }
                break;

            case "/abort":
                if (isBrewing && currentBrewing != null)
                {
                    currentBrewing.Status = Status.Aborted;
                    var abortedMessage = "The brewing process was aborted.";
                    currentBrewing.BrewingLogs.Add(new BrewingLog { StatusCode = BrewingLogCode.Info, Message = abortedMessage });

                    Console.WriteLine($"[{DateTime.Now}] {BrewingLogCode.Info}: {abortedMessage}");

                    brewingsHistory.Add(currentBrewing);
                    currentBrewing = null;
                    isBrewing = false;
                    lastUpdate = DateTime.Now;
                    responseString = "Successfully aborted.";

                }
                else
                {
                    responseString = "No brewing process to abort.";
                }
                break;

            case "/history-count":
                lastUpdate = DateTime.Now;
                if (currentBrewing is not null)
                {
                    responseString = (brewingsHistory.Count + 1).ToString();
                }
                else
                {
                    responseString = brewingsHistory.Count.ToString();
                }

                break;

            case "/is-reachable":
                lastUpdate = DateTime.Now;
                responseString = true.ToString();
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

    static bool isBrewing = false;
    static Brewing currentBrewing = null;
    static DateTime lastUpdate = DateTime.Now;
    static List<Brewing> brewingsHistory = new List<Brewing>();

}
