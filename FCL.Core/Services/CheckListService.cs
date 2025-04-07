using FastCheckList.Core.Domain;
using Skidbladnir.Repository.Abstractions;

namespace FastCheckList.Core.Services;

internal class CheckListService : ICheckListService
{
    private readonly IRepository<CheckList> _repository;

    public CheckListService(IRepository<CheckList> repository)
    {
        _repository = repository;
    }
    
    public Task<CheckList> Get(string id)
    {
        return _repository.GetAll().FirstOrDefaultAsync(x => x.Id == id);
    }

    public Task<CheckList[]> GetOldLists(TimeSpan lifeTime)
    {
        var maxDate = DateTime.UtcNow - lifeTime;
        return _repository.GetAll().Where(x => x.Created < maxDate).ToArrayAsync();
    }

    public async Task<CheckList> Create(string title)
    {
        var checkList = new CheckList()
        {
            Title = title,
            Id = Guid.NewGuid().ToString(),
            Created = DateTime.UtcNow
        };
        await _repository.Create(checkList);
        return checkList;
    }

    public async Task Update(string id, string title)
    {
        var checkList = await Get(id);
        if (checkList is null)
            return;
        checkList.Title = title;
        await _repository.Update(checkList);
    }

    public async Task Delete(string id)
    {
        var checkList = await Get(id);
        if (checkList is null)
            return;
        
        await _repository.Delete(checkList);
    }
}