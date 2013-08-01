using System;
using System.Collections.Generic;

namespace MyTouristic.Models
{
    public class Flight
    {
        //количество генерируемых вариантов
        private int AmountRandomFlight = 5;

        public string AirlineCode { get; set; }
        public int Number { get; set; }
        public DateTime Date { get; set; }
        public string Route { get; set; }

        public List<Flight> GetRandomFlight(DateTime date)
        {
            var airlineCode = new[] { "UN", "SU", "S7" };
            var number = new[] { "1235", "5421", "9875" };

            var random = new Random();

            var listFlights = new List<Flight>();

            for (int i = 0; i < AmountRandomFlight; i++)
            {
                var fl = new Flight();
                fl.AirlineCode = airlineCode[random.Next(0, 3)];
                fl.Number = Convert.ToInt32(number[random.Next(0, 3)]);
                fl.Date = date;
                listFlights.Add(fl);
            }

            return listFlights;
        }

    }
}