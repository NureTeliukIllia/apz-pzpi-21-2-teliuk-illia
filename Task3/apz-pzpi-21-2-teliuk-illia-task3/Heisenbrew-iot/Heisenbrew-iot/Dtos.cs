namespace Heisenbrew_iot
{
    public class EquipmentStatusDto
    {
        public double Temperature { get; set; }
        public double Pressure { get; set; }
        public double Humidity { get; set; }
        public double Fullness { get; set; }
        public string LastUpdate { get; set; }
        public bool IsBrewing { get; set; }
    }

    public record RecipeIngredientDto(string Name, double Quantity);

    public record RecipeDto(
        Guid Id,
        string Title,
        string Description,
        IList<RecipeIngredientDto> Ingredients,
        int UpVotesCount,
        int DownVotesCount,
        string UsersVote,
        decimal CookingPrice = 0M
    );

    public enum Status
    {
        Started,
        Filling,
        Processing,
        Finished,
        Failed,
        Aborted
    }

    public record BrewingLogDto(string Message, DateTime Time);

    public record BrewingFullInfoDto(
        string EquipmentTitle,
        string RecipeTitle,
        string BrewingStatus,
        string LastUpdateDate,
        IList<BrewingLogDto> BrewingLogs
    );
}
