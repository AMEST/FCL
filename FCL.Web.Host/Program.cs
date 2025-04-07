using FastCheckList.Web.Host.Routes;
using FastCheckList.Core;
using FCL.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddOpenApi()
    .AddStorageModule(builder.Configuration.GetValue<string>("ConnectionStrings:MongoDB", string.Empty))
    .AddCoreModule();

var app = builder.Build();
if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseStaticFiles();
app.MapCheckLists();
app.MapFallbackToFile("/index.html");
app.Run();