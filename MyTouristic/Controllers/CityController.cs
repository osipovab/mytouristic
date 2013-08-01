using System.Collections.Generic;
using System.Web.Http;

namespace MyTouristic.Controllers
{
    public class CityController: ApiController
    {
        public IEnumerable<string> Get()
        {
            return new[] {"Москва", "Санкт-Петербург", "Париж"};
        }
    }
}