﻿using BLL.EquipmentManagement;
using Core;
using Infrustructure.Dto.Equipment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace heisenbrew_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _equipmentService;

        public EquipmentController(IEquipmentService equipmentService)
        {
            _equipmentService = equipmentService;
        }

        /// <summary>
        /// Creates new brewing equipment.
        /// </summary>
        /// <param name="createBrewingEquipmentDto">The dto to create the equipment.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize(Roles = nameof(Roles.Administrator))]
        [HttpPost("create")]
        public async Task<IActionResult> CreateBrewingEquipment([FromBody] CreateBrewingEquipmentDto createBrewingEquipmentDto)
        {
            var result = await _equipmentService.AddEquipmentAsync(createBrewingEquipmentDto);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing brewing equipment.
        /// </summary>
        /// <param name="updateEquipmentDto">The dto to update the equipment.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize(Roles = nameof(Roles.Administrator))]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateBrewingEquipment([FromBody] UpdateBrewingEquipmentDto updateEquipmentDto)
        {
            var result = await _equipmentService.UpdateEquipmentAsync(updateEquipmentDto);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Deletes an existing brewing equipment.
        /// </summary>
        /// <param name="id">The id of the equipment which should be deleted.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize(Roles = nameof(Roles.Administrator))]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBrewingEquipment(Guid id)
        {
            var result = await _equipmentService.DeleteEquipmentAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets list of brewering equipment.
        /// </summary>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllEquipment()
        {
            var result = await _equipmentService.GetAllEquipmentAsync();
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets equipment by id.
        /// </summary>
        /// <param name="id">The id of the equipment.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEquipmentById(Guid id)
        {
            var result = await _equipmentService.GetBrewingEquipmentByIdAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets list of brewer's equipment.
        /// </summary>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("my-equipment")]
        public async Task<IActionResult> GetBrewerEquipment()
        {
            var result = await _equipmentService.GetBrewerEquipmentAsync();
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets equipment from brewer's inventory by id.
        /// </summary>
        /// <param name="id">The id of the equipment.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("my-equipment/{id}")]
        public async Task<IActionResult> GetBrewerEquipmentById(Guid id)
        {
            var result = await _equipmentService.GetBrewerEquipmentByIdAsync(id);
            return this.CreateResponse(result);
        }


        /// <summary>
        /// Adds equipment to brewer's inventory.
        /// </summary>
        /// <param name="id">The id of the equipment to be bought.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("my-equipment/buy/{id}")]
        public async Task<IActionResult> BuyEquipment(Guid id)
        {
            var result = await _equipmentService.BuyBrewingEquipmentAsync(id);
            return this.CreateResponse(result);
        }

    }
}
