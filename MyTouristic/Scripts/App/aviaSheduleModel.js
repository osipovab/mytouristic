AviaScheduleModel = function () {
    var self = this;

    self.routeFrom = ko.observable();
    self.routeTo = ko.observable();
    self.flightFrom = ko.observableArray([]);
    self.flightTo = ko.observableArray([]);

    var delay = 3000;

    self.search = function (fromCity, toCity, fromDate, toDate, callback) {
        $.ajax({
            url: "api/Search/SearchBySchedule",
            dataType: 'json',
            data: ({ 'fromCity': fromCity, 'toCity': toCity, 'fromDate': fromDate, 'toDate': toDate })
        }).done(function (result) {
            self.flightFrom.removeAll();
            self.flightTo.removeAll();

            setTimeout(function () {
                var filterData = {
                    airlines: [],
                    minFromTimeStart: null,
                    maxFromTimeEnd: null,
                    minToTimeStart: null,
                    maxToTimeEnd: null
                };

                //self.routeTo = result[1].Flights[0].flight.Route +  moment(result[1].Flights[0].Date).format('DD.MM.YYYY');
                $.each(result[0].Flights, function (index, flight) {
                    self.flightFrom.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                    if (_.some(filterData.airlines, function (airline) { return airline.code == flight.AirlineCode; }) == false) {
                        filterData.airlines.push({
                            code: flight.AirlineCode,
                            checked: true
                        });
                    }
                    if (filterData.minFromTimeStart == null || filterData.minFromTimeStart > moment(flight.Date).hours()) {
                        filterData.minFromTimeStart = moment(flight.Date).hours();
                    }
                    if (filterData.maxFromTimeEnd == null || filterData.maxFromTimeEnd < moment(flight.Date).hours()) {
                        filterData.maxFromTimeEnd = moment(flight.Date).hours();
                    }
                });
                $.each(result[1].Flights, function (index, flight) {
                    self.flightTo.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                    if (_.some(filterData.airlines, function (airline) { return airline.code == flight.AirlineCode; }) == false) {
                        filterData.airlines.push({
                            code: flight.AirlineCode,
                            checked: true
                        });
                    }
                    if (filterData.minToTimeStart == null || filterData.minToTimeStart > moment(flight.Date).hours()) {
                        filterData.minToTimeStart = moment(flight.Date).hours();
                    }
                    if (filterData.maxToTimeEnd == null || filterData.maxToTimeEnd < moment(flight.Date).hours()) {
                        filterData.maxToTimeEnd = moment(flight.Date).hours();
                    }
                });
                callback(filterData);
            }, delay);
        }).fail(function () {
            alert("Ошибка при поиске расписанию");
        }).always(function () {
            setTimeout(function () {
                $('#dim').css('display', 'none');
            }, delay);
        });
    };
};

