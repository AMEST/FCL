using FastCheckList.Core.Domain;

namespace FastCheckList.Core.Services;

public interface ICheckListItemService
{
    Task<CheckListItem> Get(string id);
    
    Task<CheckListItem[]> GetItems(string checkListId);

    Task<CheckListItem> Create(string checkListId, string text);
    
    Task Update(CheckListItem item);
    
    Task Delete(string checkListId, string itemId);

    Task DeleteByCheckListId(string checkListId);
}