using System;
using System.Collections.Generic;

namespace MyTouristic.Models
{
    public class Flight
    {
        public string AirlineCode { get; set; }
        public int Number { get; set; }
        public DateTime Date { get; set; }
        public string Route { get; set; }

        public List<Flight> GetRandomFlight(string fromCity, string toCity, DateTime fromDate, DateTime toDate)
        {
            var airlineCode = new[] { "UN", "SU", "S7", "AB", "AF"};
            var number = new[] { "1235", "5421", "9875" };

            var random = new Random();

            var listFlights = new List<Flight>();

            var fl = new Flight();
            fl.AirlineCode = airlineCode[random.Next(0, 5)];
            fl.Number = Convert.ToInt32(number[random.Next(0, 3)]);
            fl.Date = new DateTime(fromDate.Year, fromDate.Month, fromDate.Day, random.Next(0, 24), random.Next(0, 59), 0);
            fl.Route = fromCity + " - " + toCity;

            listFlights.Add(fl);

            fl = new Flight();
            fl.AirlineCode = airlineCode[random.Next(0, 5)];
            fl.Number = Convert.ToInt32(number[random.Next(0, 3)]);
            fl.Date = new DateTime(toDate.Year, toDate.Month, toDate.Day, random.Next(0, 24), random.Next(0, 59), 0);
            fl.Route = toCity + " - " + fromCity;

            listFlights.Add(fl);   

            return listFlights;
        }

    }
}