using System;
using System.Collections.Generic;
using System.Web.Http;
using MyTouristic.Models;

namespace MyTouristic.Controllers
{
    public class SearchController : ApiController
    {
        [HttpGet]
        public IEnumerable<Offer> SearchByPrice(string fromCity, string toCity)
        {
            return  new Offer().GetRandomOffer(fromCity, toCity, DateTime.Now); 
        }

        [HttpGet]
        public IEnumerable<Offer> SearchBySchedule(string fromCity, string toCity)
        {
            return new Offer().GetRandomOffer( fromCity,  toCity, DateTime.Now);
        }
    }
}