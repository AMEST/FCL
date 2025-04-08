using FCL.Core.Domain;

namespace FCL.Core.Services;

public interface ICheckListService
{
    Task<CheckList> Get(string id);

    Task<CheckList[]> GetOldLists(TimeSpan lifeTime);

    Task<CheckList> Create(string title);

    Task Update(string id, string title);

    Task Delete(string id);
}