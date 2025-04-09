using System.ComponentModel.DataAnnotations;

namespace FCL.Web.Host.Contracts;

public class CheckListUpdateModel
{
    [Required]
    public string Text { get; set; }
}