using System.ComponentModel.DataAnnotations;

namespace FastCheckList.Web.Host.Contracts;

public class CheckListUpdateModel
{
    [Required]
    public string Text { get; set; }
}