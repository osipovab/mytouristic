using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using MyTouristic.Models;

namespace MyTouristic.Controllers
{
    public class SearchController : ApiController
    {
        [HttpGet]
        public IEnumerable<Offer> SearchByPrice(string fromCity, string toCity, string fromDate, string toDate)
        {
            var fDate = DateTime.Parse(fromDate);
            var tDate = DateTime.Parse(toDate);
            var nOffer = new Offer().GetRandomOffer(fromCity, toCity, fDate, tDate, "byPrice");

            return nOffer;
        }

        [HttpGet]
        public IEnumerable<Offer> SearchBySchedule(string fromCity, string toCity, string fromDate, string toDate)
        {
            var fDate = DateTime.Parse(fromDate);
            var tDate = DateTime.Parse(toDate);
            return new Offer().GetRandomOffer(fromCity, toCity, fDate, tDate, "byShedule"); 
        }

    }
}