using Skidbladnir.Repository.Abstractions;

namespace FCL.Core.Domain;

public class CheckList : IHasId<string>
{
    public string Id { get; set; }

    public string Title { get; set; }

    public DateTime Created { get; set; }
}