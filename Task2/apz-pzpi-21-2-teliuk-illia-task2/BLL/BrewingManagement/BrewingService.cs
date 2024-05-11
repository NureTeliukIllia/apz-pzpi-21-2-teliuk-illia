using AutoMapper;
using BLL.BrewingManagement;
using Core;
using Core.Models;
using Core.Models.Equipment;
using DAL;
using Infrustructure.Dto.Brewing;
using Infrustructure.Dto.Equipment;
using Infrustructure.Dto.Ingredient;
using Infrustructure.Dto.Recipe;
using Infrustructure.ErrorHandling.Errors.Base;
using Infrustructure.ErrorHandling.Errors.ServiceErrors;
using Infrustructure.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.BrewingManagement
{
    public class BrewingService : IBrewingService
    {
        private readonly ILogger<BrewingService> _logger;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public BrewingService(ILogger<BrewingService> logger, IMapper mapper, ApplicationDbContext context, IHttpContextAccessor contextAccessor)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
            _contextAccessor = contextAccessor;
        }
        public async Task<Result<string, Error>> AbortBrewingAsync(Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var equipment = await _context.BrewerBrewingEquipment.Where(bE => bE.Id == equipmentId).Include(bBE => bBE.BrewingEquipment).Include(bBE => bBE.Brewings).ThenInclude(b => b.BrewingLogs).FirstOrDefaultAsync();

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }

                if (!equipment.IsBrewing)
                {
                    return BrewingServiceErrors.NoBrewingsNowError;
                }
                ;


                var brewing = await _context.Brewings.Where(b => b.BrewerBrewingEquipmentId == equipmentId)
                    .OrderBy(b => b.CreatedAt).LastOrDefaultAsync();

                if (brewing is null)
                {
                    return BrewingServiceErrors.GetBrewingByIdError;
                }

                brewing.Status = Status.Aborted;
                equipment.IsBrewing = false;
                await _context.SaveChangesAsync();

                return $"Successfully stopped the brewing on {equipment.BrewingEquipment.Name}";

            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.AbortBrewingAsync ERROR: {ex.Message}");
                return BrewingServiceErrors.AbortBrewingError;
            }
        }

        public async Task<Result<BrewingFullInfoDto, Error>> GetBrewingStatusAsync(Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var user = await _context.Brewers.Include(u => u.Ingredients).FirstOrDefaultAsync(u => u.Id == userId);
                var equipment = await _context.BrewerBrewingEquipment.Include(bE => bE.BrewingEquipment).FirstOrDefaultAsync(bE => bE.Id == equipmentId);

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }


                if (!equipment.IsBrewing)
                {
                    return BrewingServiceErrors.NoBrewingsNowError;
                }


                var brewing = await _context.Brewings.Where(b => b.BrewerBrewingEquipmentId == equipmentId).OrderByDescending(b => b.CreatedAt).Include(b => b.BrewingLogs).Include(b => b.Recipe).Include(b => b.BrewerBrewingEquipment).ThenInclude(bE => bE.BrewingEquipment).FirstOrDefaultAsync();



                //IoT Logic

                return new BrewingFullInfoDto
                (
                    brewing.Id,
                    brewing.BrewerBrewingEquipment.BrewingEquipment.Name,
                    brewing.Recipe.Title,
                    Enum.GetName(typeof(Status), brewing.Status),
                    brewing.BrewingLogs.Select(b => b.LogTime).LastOrDefault().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss"),
                    _mapper.Map<IList<BrewingLogDto>>(brewing.BrewingLogs)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.GetBrewingStatusAsync ERROR: {ex.Message}");
                return BrewingServiceErrors.GetBrewingStatusError;
            }
        }


        public async Task<Result<List<BrewingShortInfoDto>, Error>> GetBrewingsAsync(Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var equipment = await _context.BrewerBrewingEquipment.Where(bE => bE.Id == equipmentId).Include(bBE => bBE.BrewingEquipment).Include(bBE => bBE.Brewings).ThenInclude(b => b.BrewingLogs).FirstOrDefaultAsync();

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }

                var brewings = await _context.Brewings.Where(b => b.BrewerBrewingEquipmentId == equipmentId).OrderByDescending(b => b.CreatedAt).Include(b => b.BrewingLogs).Include(b => b.Recipe).Include(b => b.BrewerBrewingEquipment).ThenInclude(bE => bE.BrewingEquipment).ToListAsync();

                return brewings.Select(brewing => new BrewingShortInfoDto
                (
                    brewing.BrewerBrewingEquipment.BrewingEquipment.Name,
                    brewing.Recipe.Title,
                    Enum.GetName(typeof(Status), brewing.Status),
                    brewing.BrewingLogs.Select(b => b.LogTime).LastOrDefault().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss")
                )).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.GetBrewingsAsync ERROR: {ex.Message}");
                return BrewingServiceErrors.GetBrewingListError;
            }
        }

        public async Task<Result<string, Error>> StartBrewingAsync(Guid recipeId, Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var user = await _context.Brewers.Include(u => u.Ingredients).FirstOrDefaultAsync(u => u.Id == userId);
                var equipment = await _context.BrewerBrewingEquipment.Include(bE => bE.BrewingEquipment).FirstOrDefaultAsync(bE => bE.Id == equipmentId);

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }


                if (equipment.IsBrewing)
                {
                    return BrewingServiceErrors.EquipmentIsBusyError;
                }

                var recipe = await _context.Recipes.Include(r => r.Ingredients).ThenInclude(i => i.Ingredient).FirstOrDefaultAsync(r => r.Id == recipeId);


                foreach (var ingredient in recipe.Ingredients)
                {
                    if (!user.Ingredients.Select(i => i.IngredientId).ToList().Contains(ingredient.IngredientId))
                    {
                        return BrewingServiceErrors.DontHaveIngredientError(ingredient.Ingredient.Name);
                    }

                    var usersIngredient = user.Ingredients.FirstOrDefault(i => i.IngredientId == ingredient.IngredientId);

                    if (usersIngredient.Weight < ingredient.Weight)
                    {
                        return BrewingServiceErrors.DontHaveEnoughIngredientError(ingredient.Ingredient.Name);
                    }

                    usersIngredient.Weight -= ingredient.Weight;
                }
                var recipeJson = JsonConvert.SerializeObject(new RecipeShortInfoDto(recipe.Id, recipe.Title, recipe.Description, _mapper.Map<IList<RecipeIngredientDto>>(recipe.Ingredients)), Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        PreserveReferencesHandling = PreserveReferencesHandling.Objects
                    }
                );
                var equipmentStatus = await StartBrewingOnIoTDeviceAsync(equipment.ConnectionString, new StringContent(recipeJson));
                var brewingStatus = Enum.TryParse(equipmentStatus.BrewingStatus, out Status status);
                var brewing = new Brewing { Id = equipmentStatus.Id, BrewerBrewingEquipmentId = equipmentId, RecipeId = recipeId, Status = status, BrewingLogs = _mapper.Map<ICollection<BrewingLog>>(equipmentStatus.BrewingLogs), CreatedAt = DateTime.Now };
                brewing.BrewingLogs.Add(new BrewingLog { Brewing = brewing, StatusCode = BrewingLogCode.Info, Message = "Starting the brewing process", LogTime = DateTime.Now });
                //IoT Logic

                await _context.Brewings.AddAsync(brewing);
                await _context.SaveChangesAsync();
                return $"Successfully started brewing the \"{recipe.Title}\" on your \"{equipment.BrewingEquipment.Name}\"!";
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.StartBrewingAsync ERROR: {ex.Message}");
                return BrewingServiceErrors.CreateBrewingError;
            }
        }
        private async Task<BrewingFullInfoDto> StartBrewingOnIoTDeviceAsync(string connectionString, HttpContent recipe)
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.PostAsync($"{connectionString}startbrewing", recipe);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var status = JsonConvert.DeserializeObject<BrewingFullInfoDto>(content);
                    return status;
                }
                else
                {
                    throw new Exception($"Failed to start brewing on the IoT device. Status code: {response.StatusCode}");
                }
            }
        }
    }
}
