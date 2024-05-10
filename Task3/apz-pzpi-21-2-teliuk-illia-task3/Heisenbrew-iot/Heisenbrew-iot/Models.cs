namespace Heisenbrew_iot
{
    public class Brewing
    {
        public Guid RecipeId { get; set; }
        public ICollection<BrewingLog> BrewingLogs { get; set; }
        public Status Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }   
    
    public class BrewingLog
    {
        public BrewingLogCode StatusCode { get; set; }
        public string Message { get; set; }
        public DateTime LogTime { get; set; }
    }

    public enum BrewingLogCode
    {
        Info,
        Warning,
        CriticalError
    }
}
