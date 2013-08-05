using System;
using System.Collections.Generic;
using System.Linq;


namespace MyTouristic.Models
{
    public class Offer
    {
        public List<Flight> Flights { get; set; }
        public double Price { get; set; }

        public List<Offer> GetRandomOffer(string fromCity, string toCity, DateTime fromDate, DateTime toDate)
        {
            var listOffer = new List<Offer>();
            var random = new Random();
            for (var i = 0; i < 10; i++ )
            {
                listOffer.Add(new Offer { Flights = new Flight().GetRandomFlight(fromCity, toCity, fromDate, toDate), Price = random.Next(2000, 5000) });
            }
                
            return listOffer.OrderBy(r=>r.Price).ToList();
        }
    }
}