using FastCheckList.Web.Host.Contracts;
using FastCheckList.Web.Host.Mappings;
using FastCheckList.Core.Services;

namespace FastCheckList.Web.Host.Routes;

public static class CheckListRoutes
{
    private const string _routePrefix = "/api/checklist";
    
    public static IEndpointRouteBuilder MapCheckLists(this IEndpointRouteBuilder endpoints)
    {
        // CheckList
        endpoints.MapGet($"{_routePrefix}/{{id}}", GetCheckList);
        endpoints.MapPost(_routePrefix, CreateCheckList);
        endpoints.MapPut($"{_routePrefix}/{{id}}", UpdateCheckList);
        // CheckListItems
        endpoints.MapGet($"{_routePrefix}/{{id}}/{{itemId}}", GetCheckListItem);
        endpoints.MapPost($"{_routePrefix}/{{id}}", CreateCheckListItem);
        endpoints.MapPut($"{_routePrefix}/{{id}}/{{itemId}}", UpdateCheckListItem);
        endpoints.MapDelete($"{_routePrefix}/{{id}}/{{itemId}}", DeleteCheckListItem);
        
        return endpoints;
    }

    private static async Task<IResult> GetCheckList(ICheckListService checkListService,
        ICheckListItemService itemService, string id)
    {
        var checkList = await checkListService.Get(id);
        if (checkList is null)
            return Results.NotFound();
        
        var items = await itemService.GetItems(id);
        return Results.Ok(checkList.ToModel(items));
    }

    private static async Task<CheckListModel> CreateCheckList(ICheckListService checklistService)
    {
        var checkList = await checklistService.Create("New checklist");
        return checkList.ToModel();
    }

    private static async Task UpdateCheckList(ICheckListService checkListService, string id, CheckListUpdateModel updateModel)
    {
        await checkListService.Update(id, updateModel.Text);
    }

    private static async Task<IResult> GetCheckListItem(ICheckListItemService checkListItemService, string id,
        string itemId)
    {
        var item = await checkListItemService.Get(itemId);
        if (item is null || item.CheckListId != id)
            return Results.NotFound();
        
        return Results.Ok(item.ToModel());
    }

    private static async Task<CheckListItemModel> CreateCheckListItem(ICheckListItemService checkListItemService,
        string id, CheckListItemUpdateModel model)
    {
        var item = await checkListItemService.Create(id, model?.Text ?? string.Empty);
        return item.ToModel();
    }

    private static async Task UpdateCheckListItem(ICheckListItemService checkListItemService, string id, string itemId,
        CheckListItemUpdateModel updateModel)
    {
        var item = await checkListItemService.Get(itemId);
        if (item is null || item.CheckListId != id)
            return;

        item.Text = updateModel.Text;
        item.IsChecked = updateModel.IsChecked;
        await checkListItemService.Update(item);
    }
    
    private static async Task DeleteCheckListItem(ICheckListItemService checkListItemService, string id, string itemId)
    {
        await checkListItemService.Delete(id, itemId);
    }
}