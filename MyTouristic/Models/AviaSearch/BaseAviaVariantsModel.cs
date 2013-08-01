using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyTouristic.Models.AviaSearch
{
    public class BaseAviaVariantsModel
    {
        public List<Flights> Flights { get; set; }
    }

    public class Flights
    {
        public string AirlineCode { get; set; }
        public int Number { get; set; }
        public DateTime Date { get; set; }
        public string Route { get; set; }
    }
}