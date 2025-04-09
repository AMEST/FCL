using Cronos;
using Microsoft.Extensions.Hosting;

namespace FastCheckList.Core.Background;

public abstract class ScheduledBackgroundHostedService(IServiceProvider serviceProvider) : IHostedService
{
    private readonly CancellationTokenSource _scheduleCancellationTokenSource = new CancellationTokenSource();

    /// <summary>
    /// Cron rule for running scheduled module
    /// </summary>
    public abstract string CronExpression { get; }
    
    /// <summary>
    /// Method that is run based on Cron expression
    /// </summary>
    public abstract Task ExecuteAsync(IServiceProvider provider, CancellationToken cancellationToken = default);
    
    public Task StartAsync(CancellationToken cancellationToken)
    {
        Task.Run(async () =>
        {
            var cronExpression = Cronos.CronExpression.Parse(CronExpression);
            var nextExecutionDelay = GetDelayBeforeNextExecution(cronExpression);
            while (!_scheduleCancellationTokenSource.Token.IsCancellationRequested)
            {
                await Task.Delay(nextExecutionDelay, _scheduleCancellationTokenSource.Token);

                await ExecuteAsync(serviceProvider, _scheduleCancellationTokenSource.Token);

                nextExecutionDelay = GetDelayBeforeNextExecution(cronExpression);
            }
        }, cancellationToken);
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _scheduleCancellationTokenSource.Cancel();
        return Task.CompletedTask;
    }
    
    private static TimeSpan GetDelayBeforeNextExecution(CronExpression expression)
    {
        var nextOccurrence = expression.GetNextOccurrence(DateTime.UtcNow);
        if (nextOccurrence == null)
            return TimeSpan.Zero;

        var nextExecutionTime = nextOccurrence - DateTime.UtcNow;
        return nextExecutionTime.Value >= TimeSpan.Zero
            ? nextExecutionTime.Value
            : TimeSpan.Zero;
    }
}