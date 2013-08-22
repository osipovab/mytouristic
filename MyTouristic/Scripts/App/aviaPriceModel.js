AviaPriceModel = function () {
    var self = this;
    self.offers = ko.observableArray([]);

    var delay = 3000;

    self.search = function (fromCity, toCity, fromDate, toDate, callback) {
        self.offers.removeAll();

        $.ajax({
            url: "api/Search/SearchByPrice",
            dataType: 'json',
            data: ({ 'fromCity': fromCity, 'toCity': toCity, 'fromDate': fromDate, 'toDate': toDate })
        }).done(function (result) {
            self.offers.removeAll();
            setTimeout(function () {
                var filterData = {
                    airlines: [],
                    minFromTimeStart: null,
                    maxFromTimeEnd: null,
                    minToTimeStart: null,
                    maxToTimeEnd: null
                };

                $.each(result, function (index, offer) {
                    var flights = [];
                    $.each(offer.Flights, function (index, flight) {
                        flights.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                        if (_.some(filterData.airlines, function (airline) { return airline.code == flight.AirlineCode; }) == false) {
                            filterData.airlines.push({
                                code: flight.AirlineCode,
                                checked: true
                            });
                        }
                    });
                    if (filterData.minFromTimeStart == null || filterData.minFromTimeStart > moment(offer.Flights[0].Date).hours()) {
                        filterData.minFromTimeStart = moment(offer.Flights[0].Date).hours();
                    }
                    if (filterData.maxFromTimeEnd == null || filterData.maxFromTimeEnd < moment(offer.Flights[0].Date).hours()) {
                        filterData.maxFromTimeEnd = moment(offer.Flights[0].Date).hours();
                    }
                    if (filterData.minToTimeStart == null || filterData.minToTimeStart > moment(offer.Flights[1].Date).hours()) {
                        filterData.minToTimeStart = moment(offer.Flights[1].Date).hours();
                    }
                    if (filterData.maxToTimeEnd == null || filterData.maxToTimeEnd < moment(offer.Flights[1].Date).hours()) {
                        filterData.maxToTimeEnd = moment(offer.Flights[1].Date).hours();
                    }
                    self.offers.push(new Offer(flights, offer.Price));
                });
                callback(filterData);
            }, delay);
        }).always(function () {
            setTimeout(function () {
                $('#dim').css('display', 'none');
            }, delay);
        }).fail(function () { alert("Ошибка при поиске по цене"); });
    };
};
