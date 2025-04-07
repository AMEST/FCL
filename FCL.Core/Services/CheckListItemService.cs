using FastCheckList.Core.Domain;
using Skidbladnir.Repository.Abstractions;

namespace FastCheckList.Core.Services;

internal class CheckListItemService : ICheckListItemService
{
    private readonly IRepository<CheckListItem> _repository;

    public CheckListItemService(IRepository<CheckListItem> repository)
    {
        _repository = repository;
    }
    
    public Task<CheckListItem> Get(string id)
    {
        return _repository.GetAll().FirstOrDefaultAsync(x => x.Id == id);
    }

    public Task<CheckListItem[]> GetItems(string checkListId)
    {
        return _repository.GetAll().Where(x => x.CheckListId == checkListId).ToArrayAsync();
    }

    public async Task<CheckListItem> Create(string checkListId, string text)
    {
        var item = new CheckListItem()
        {
            Id = Guid.NewGuid().ToString(),
            CheckListId = checkListId,
            Text = text,
            Created = DateTime.UtcNow,
            IsChecked = false
        };
        await _repository.Create(item);
        return item;
    }

    public async Task Update(CheckListItem item)
    {
        var dbItem = await Get(item.Id);
        if (dbItem is null)
            return;
        
        dbItem.Text = item.Text;
        dbItem.IsChecked = item.IsChecked;
        dbItem.Modified = DateTime.UtcNow;

        await _repository.Update(dbItem);
    }

    public async Task Delete(string checkListId, string itemId)
    {
        var item = await _repository.GetAll().FirstOrDefaultAsync(x => x.Id == itemId && x.CheckListId == checkListId);
        if (item is null)
            return;
        await _repository.Delete(item);
    }

    public async Task DeleteByCheckListId(string checkListId)
    {
        var items = await _repository
            .GetAll()
            .Where(x => x.CheckListId == checkListId)
            .ToArrayAsync();
        if ( items.Length == 0 )
            return;
        foreach (var item in items)
            await _repository.Delete(item);
    }
}