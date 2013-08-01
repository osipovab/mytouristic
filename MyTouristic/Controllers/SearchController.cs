using System;
using System.Collections.Generic;
using System.Web.Http;
using MyTouristic.Models;

namespace MyTouristic.Controllers
{
    public class SearchController : ApiController
    {
        [HttpGet]
        public IEnumerable<Offer> SearchByPrice()
        {
            return  new Offer().GetRandomOffer(DateTime.Now); 
        }

        [HttpGet]
        public IEnumerable<Offer> SearchBySchedule()
        {
            return new Offer().GetRandomOffer(DateTime.Now);
        }


    }
}