namespace FCL.Web.Host.Contracts;

public class CheckListModel
{
    public string Id { get; set; }

    public string Title { get; set; }

    public CheckListItemModel[] Items { get; set; } = [];
}