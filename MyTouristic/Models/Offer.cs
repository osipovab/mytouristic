using System;
using System.Collections.Generic;


namespace MyTouristic.Models
{
    public class Offer
    {
        public List<Flight> Flights { get; set; }
        public double Price { get; set; }

        public List<Offer> GetRandomOffer(DateTime date)
        {
            var listOffer = new List<Offer>();
            var random = new Random();
            for (var i = 0; i < 5; i++ )
            {
                listOffer.Add(new Offer { Flights = new Flight().GetRandomFlight(date), Price =  random.Next(2000, 5000)});
            }
                
            return listOffer;
        }
    }
}