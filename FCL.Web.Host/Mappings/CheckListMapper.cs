using FastCheckList.Web.Host.Contracts;
using FastCheckList.Core.Domain;

namespace FastCheckList.Web.Host.Mappings;

public static class CheckListMapper
{
    public static CheckListModel ToModel(this CheckList checkListModel, params CheckListItem[] items)
    {
        return new CheckListModel()
        {
            Id = checkListModel.Id,
            Title = checkListModel.Title,
            Items = items.Select(ToModel).ToArray()
        };
    }
    
    public static CheckListItemModel ToModel(this CheckListItem checkListItem)
    {
        return new CheckListItemModel()
        {
            Id = checkListItem.Id,
            Text = checkListItem.Text,
            IsChecked = checkListItem.IsChecked
        };
    }
}