using Skidbladnir.Repository.Abstractions;

namespace FCL.Core.Domain;

public class CheckListItem : IHasId<string>
{
    public string Id { get; set; }
    
    public string CheckListId { get; set; }
    
    public string Text { get; set; }
    
    public bool IsChecked { get; set; }
    
    public DateTime Created { get; set; }
    
    public DateTime? Modified { get; set; }
}