using Microsoft.AspNetCore.SignalR;

namespace FCL.Web.Host.Hubs
{
    public class CheckListHub : Hub
    {
        public async Task SubscribeToCheckList(string checklistId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, checklistId);
            await Clients.Caller.SendAsync("ConnectedToHub", "Connected to the hub");
        }
    }
}
