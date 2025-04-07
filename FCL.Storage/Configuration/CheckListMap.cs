using FastCheckList.Core.Domain;
using Skidbladnir.Repository.MongoDB;

namespace FCL.Storage.Configuration;

public class CheckListMap : EntityMapClass<CheckList>
{
    public CheckListMap()
    {
        ToCollection("checkList");
    }
}