﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrustructure.Dto.Equipment
{
    public record BrewerBrewingEquipmentShortInfoDto
    (
        Guid Id,
        string Name,
        bool IsBrewing
    );
}
