using FastCheckList.Core.Domain;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Skidbladnir.Repository.MongoDB;

namespace FCL.Storage;

internal class IndexCreationHostedService : IHostedService
{
    private readonly BaseMongoDbContext _mongoDbContext;
    private readonly ILogger<IndexCreationHostedService> _logger;

    public IndexCreationHostedService(BaseMongoDbContext mongoDbContext, ILogger<IndexCreationHostedService> logger)
    {
        _mongoDbContext = mongoDbContext;
        _logger = logger;
    }
    
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await CreateCheckListIndexes();
            await CreateCheckListItemIndexes();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Can't create indexes");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
    
    private async Task CreateCheckListIndexes()
    {
        var collection = _mongoDbContext.GetCollection<CheckList>();
        var checkListCreatedDateKeyDefinition = Builders<CheckList>.IndexKeys.Ascending(x => x.Created);
        await collection.Indexes.CreateOneAsync(new CreateIndexModel<CheckList>(checkListCreatedDateKeyDefinition,
            new CreateIndexOptions() { Background = true }
        ));
    }
    
    private async Task CreateCheckListItemIndexes()
    {
        var collection = _mongoDbContext.GetCollection<CheckListItem>();
        
        var idCheckListIdKeyDefinition = Builders<CheckListItem>.IndexKeys
            .Ascending(x => x.Id)
            .Ascending(x => x.CheckListId);
        await collection.Indexes.CreateOneAsync(new CreateIndexModel<CheckListItem>(idCheckListIdKeyDefinition,
            new CreateIndexOptions() { Background = true }
        ));
        
        var checkListIdKeyDefinition = Builders<CheckListItem>.IndexKeys.Ascending(x => x.CheckListId);
        await collection.Indexes.CreateOneAsync(new CreateIndexModel<CheckListItem>(checkListIdKeyDefinition,
            new CreateIndexOptions() { Background = true }
        ));
    }

}