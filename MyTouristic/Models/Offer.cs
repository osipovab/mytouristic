using System;
using System.Collections.Generic;
using System.Linq;


namespace MyTouristic.Models
{
    public class Offer
    {
        public List<Flight> Flights { get; set; }
        public double Price { get; set; }

        public List<Offer> GetRandomOffer(string fromCity, string toCity, DateTime fromDate, DateTime toDate, string searchType)
        {
            var listOffer = new List<Offer>();
            var random = new Random();

            if (searchType == "byPrice")
            {
                for (var i = 0; i < 10; i++)
                {
                    var fl = new List<Flight>();
                    fl = new Flight().GetRandomFlight(fromCity, toCity, fromDate, toDate);
                    System.Threading.Thread.Sleep(10);
                    listOffer.Add(new Offer {Flights = fl, Price = random.Next(2000, 9000)});
                }

                return listOffer.OrderBy(r => r.Price).ToList();
            }
            else
            {
                var fl = new List<Flight>();
                fl = new Flight().GetRandomFlightByShedule(fromCity, toCity, fromDate);
                listOffer.Add(new Offer { Flights = fl, Price = random.Next(2000, 9000) });
                System.Threading.Thread.Sleep(150);
                fl = new Flight().GetRandomFlightByShedule(toCity, fromCity, toDate);
                System.Threading.Thread.Sleep(150);
                listOffer.Add(new Offer { Flights = fl, Price = random.Next(2000, 9000) });
                return listOffer;
            }
        }
    }
}