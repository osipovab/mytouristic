using System;
using System.Collections.Generic;
using System.Web.Http;
using MyTouristic.Models;

namespace MyTouristic.Controllers
{
    public class SearchController : ApiController
    {
        [HttpGet]
        public IEnumerable<Offer> SearchByPrice(string fromCity, string toCity, DateTime fromDate, DateTime toDate)
        {
            return new Offer().GetRandomOffer(fromCity, toCity, fromDate, toDate); 
        }

        [HttpGet]
        public IEnumerable<Offer> SearchBySchedule(string fromCity, string toCity, DateTime fromDate, DateTime toDate)
        {
            return new Offer().GetRandomOffer(fromCity, toCity, fromDate, toDate); 
        }
    }
}