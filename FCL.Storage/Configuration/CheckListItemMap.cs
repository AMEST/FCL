using FCL.Core.Domain;
using Skidbladnir.Repository.MongoDB;

namespace FCL.Storage.Configuration;

public class CheckListItemMap : EntityMapClass<CheckListItem>
{
    public CheckListItemMap()
    {
        ToCollection("checkListItems");
        MapField(x => x.IsChecked)
            .SetIgnoreIfDefault(false);
    }
}