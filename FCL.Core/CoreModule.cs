using FCL.Core.Services;
using Microsoft.Extensions.DependencyInjection;

namespace FCL.Core;

public static class CoreModule
{
    public static IServiceCollection AddCoreModule(this IServiceCollection services)
    {
        return services.AddSingleton<ICheckListService, CheckListService>()
            .AddSingleton<ICheckListItemService, CheckListItemService>();
    }
}