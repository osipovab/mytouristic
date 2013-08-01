using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace MyTouristic.Models.AviaSearch
{
    public class AviaFormModel
    {
        public List<string> City = new List<string> {"Москва", "Париж", "Санкт-Петербург"};
        public string SelectedFrom { get; set; }
        public string SelectedTo { get; set; }
        public DateTime DateDeparture { get; set; }
        public DateTime DateArrive { get; set; }
        public bool PriceSearch { get; set;}
    }
}