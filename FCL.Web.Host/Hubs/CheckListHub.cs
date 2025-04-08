using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace FCL.Web.Host.Hubs
{
    [AllowAnonymous]
    public class CheckListHub : Hub
    {
        public async Task SubscribeToCheckList(string checklistId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, checklistId);
        }

        public async Task UnsubscribeFromCheckList(string checklistId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, checklistId);
        }
    }
}
