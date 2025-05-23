using FCL.Web.Host.Routes;
using FCL.Core;
using FCL.Storage;
using FCL.Web.Host.Hubs;
using Microsoft.AspNetCore.Http.Connections;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddOpenApi()
    .AddStorageModule(builder.Configuration.GetValue<string>("ConnectionStrings:MongoDB", string.Empty))
    .AddCoreModule();

var signalRBuilder = builder.Services.AddSignalR(options => {
    options.EnableDetailedErrors = true;
    options.ClientTimeoutInterval = TimeSpan.FromMinutes(1);
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.MaximumReceiveMessageSize = 32 * 1024;
}).AddHubOptions<CheckListHub>(options => {
    options.EnableDetailedErrors = true;
    options.ClientTimeoutInterval = TimeSpan.FromMinutes(1);
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.MaximumReceiveMessageSize = 32 * 1024;
});
var redisConnectionString = builder.Configuration.GetValue<string>("ConnectionStrings:Redis", string.Empty);
if(!string.IsNullOrEmpty(redisConnectionString))
    signalRBuilder.AddStackExchangeRedis(redisConnectionString);
builder.Services.AddSingleton<CheckListHub>();

var app = builder.Build();


if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapCheckLists();
app.MapHub<CheckListHub>("/api/hubs/checklists", options => {
    options.TransportMaxBufferSize = 0;
    options.Transports = HttpTransportType.WebSockets;
});
app.MapFallbackToFile("/index.html");
app.Run();
