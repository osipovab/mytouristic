using System;
using System.Collections.Generic;

namespace MyTouristic.Models.AviaSearch
{
    [Serializable]
    public class AviaProcessContainerModel
    {
        public AviaFormModel AviaForm = new AviaFormModel();
        public IEnumerable<AviaFilterModel> AviaFilter { get; set; }
        public IEnumerable<AviaPriceModel> AviaPrice { get; set; }
        public IEnumerable<AviaScheduleModel> AviaSchedule { get; set; }
    }
}
