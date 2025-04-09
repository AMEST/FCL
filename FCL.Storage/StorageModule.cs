using FCL.Core.Domain;
using FCL.Storage.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Skidbladnir.Repository.MongoDB;

namespace FCL.Storage;

public static class StorageModule
{
    public static IServiceCollection AddStorageModule(this IServiceCollection services, string connectionString)
    {
        return services.AddMongoDbContext(b =>
                b.UseConnectionString(connectionString)
                    .AddEntity<CheckList, CheckListMap>()
                    .AddEntity<CheckListItem, CheckListItemMap>()
            )
            .AddHostedService<IndexCreationHostedService>();
    }
}