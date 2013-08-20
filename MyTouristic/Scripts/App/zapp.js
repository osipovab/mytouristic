
AviaProcessContainerModel = function() {
    var self = this;
    
    self.aviaFormModel = new AviaFormModel();
    self.aviaPriceModel = new AviaPriceModel();
    self.aviaScheduleModel = new AviaScheduleModel();
    self.aviaFilterModel = ko.observable(null);
    
    self.init = function () {
        self.aviaFormModel.init();
    };
    self.search = function () {
        self.aviaFilterModel(null);
        //if (self.validation()) {
        if (self.aviaFormModel.searchType() == "byPrice") {
                var fDate = self.aviaFormModel.fromDate().getFullYear() + '-' + (self.aviaFormModel.fromDate().getMonth() + 1) + '-' + self.aviaFormModel.fromDate().getDate();
                var tDate = self.aviaFormModel.toDate().getFullYear() + '-' + (self.aviaFormModel.toDate().getMonth() + 1) + '-' + self.aviaFormModel.toDate().getDate();
                self.aviaPriceModel.search(self.aviaFormModel.fromCity(), self.aviaFormModel.toCity(), fDate, tDate, self.updateFilter);

               
        } else {
                var fDate = self.aviaFormModel.fromDate().getFullYear() + '-' + (self.aviaFormModel.fromDate().getMonth() + 1) + '-' + self.aviaFormModel.fromDate().getDate();
                var tDate = self.aviaFormModel.toDate().getFullYear() + '-' + (self.aviaFormModel.toDate().getMonth() + 1) + '-' + self.aviaFormModel.toDate().getDate();
                self.aviaScheduleModel.search(self.aviaFormModel.fromCity(), self.aviaFormModel.toCity(), fDate, tDate, self.updateFilter);
            }
        //}
    };

    self.validation = function () {
            var errorString = "";
            if (self.aviaFormModel.fromCity() == self.aviaFormModel.toCity())
                errorString += "Пункт вылета не должен совпадать с пунктом прилета";

            if (errorString.length > 1) { alert(errorString); return false; } else { return true; }
    };
    
    self.reset = function () {
        self.aviaPriceModel.offers.removeAll();
        self.aviaScheduleModel.flightFrom.removeAll();
        self.aviaScheduleModel.flightTo.removeAll();
    };

    self.updateFilter = function (filter) {
        //self.aviaFilterModel = ko.mapping.fromJS(new AviaFilterModel(filter));
        var filterModel = new AviaFilterModel(filter);
        self.aviaFilterModel(ko.mapping.fromJS(filterModel));
    };

    self.filteredOffers = ko.computed(function () {
        if (!self.aviaFilterModel()) {
            return self.aviaPriceModel.offers();
        }
        var offers = [];
        $.each(self.aviaPriceModel.offers(), function (index, offer) {
            $.each(offer.flights(), function (index, flight) {
                $.each(self.aviaFilterModel().airlines(), function (index, airline) {
                    if (flight.airlineCode() === airline.code() && airline.checked()) {
                        if (offers.indexOf(offer) < 0) {
                            offers.push(offer);
                        }
                    }
                });
            });
        });
        return offers;
    });

};

AviaFormModel = function () {
    var self = this;

    self.error = ko.observable();
    self.cities = ko.observable([]);
    self.fromCity = ko.observable();
    self.toCity = ko.observable();
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.searchType = ko.observable("byPrice");

    self.init = function () {
        loadCities();
        loadDate();
    };
    
    function loadCities() {
        $.ajax({
            url: "api/City",
            success: function (result) {
                self.cities(result);
                self.fromCity(result[0]);
                self.toCity(result[1]);
            },
            error: function () { self.error("Ошибка при загрузке списка городов"); }
        });
    }

    function loadDate() {
        self.fromDate(new Date);
        var myDate = new Date();
        myDate.setDate(myDate.getDate() + 7);
        self.toDate(myDate);
    }

};


AviaPriceModel = function () {
    var self = this;

    self.offers = ko.observableArray([]);
    
    self.search = function (fromCity, toCity, fromDate, toDate, callback) {

        $.ajax({
            url: "api/Search/SearchByPrice",
            dataType: 'json',
            data: ({ 'fromCity': fromCity, 'toCity': toCity, 'fromDate': fromDate, 'toDate' : toDate }),
            success: function (result) {
                self.offers.removeAll();
                var filterData = {
                    airlines: [],
                    minFromTimeStart: null,
                    maxFromTimeEnd: null,
                    minToTimeStart: null,
                    maxToTimeEnd: null
                };
                $.each(result, function (index, offer) {
                    var flights = [];
                    $.each(offer.Flights, function(index, flight) {
                        flights.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                        if (_.some(filterData.airlines, function(airline) { return airline.code == flight.AirlineCode; }) == false){
                            filterData.airlines.push({
                                code: flight.AirlineCode,
                                checked: true
                            });
                        }
                    });
                    if (filterData.minFromTimeStart == null || filterData.minFromTimeStart > moment(flights[0].Date).hours()) {
                        filterData.minFromTimeStart = moment(flights[0].Date).hours();
                    }
                    if (filterData.maxFromTimeEnd == null || filterData.maxFromTimeEnd < moment(flights[0].Date).hours()) {
                        filterData.maxFromTimeEnd = moment(flights[0].Date).hours();
                    }
                    if (filterData.minToTimeStart == null || filterData.minToTimeStart > moment(flights[1].Date).hours()) {
                        filterData.minToTimeStart = moment(flights[1].Date).hours();
                    }
                    if (filterData.maxToTimeEnd == null || filterData.maxToTimeEnd < moment(flights[1].Date).hours()) {
                        filterData.maxToTimeEnd = moment(flights[1].Date).hours();
                    }
                    self.offers.push(new Offer(flights, offer.Price));
                });
                callback(filterData);
            },
            error: function() { alert("Ошибка при поиске по цене"); }
        });
    };
};


AviaScheduleModel = function() {
    var self = this;
    
    self.flightFrom = ko.observableArray([]);
    self.flightTo = ko.observableArray([]);
    
    self.search = function (fromCity, toCity, fromDate, toDate) {
        $.ajax({
            url: "api/Search/SearchBySchedule",
            dataType: 'json',
            data: ({ 'fromCity': fromCity, 'toCity': toCity, 'fromDate': fromDate, 'toDate': toDate }),
            success: function (result) {
                    self.flightFrom.removeAll();
                    self.flightTo.removeAll();
                    $.each(result[0].Flights, function (index, flight) {
                        self.flightFrom.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                    });  
                    $.each(result[1].Flights, function (index, flight) {
                        self.flightTo.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                    });
            },
            error: function () { alert("Ошибка при поиске расписанию"); }
        });
    };
};


Offer = function(flights, price) {
    var self = this;

    self.flights = ko.observableArray(flights);
    self.price = ko.observable(price);
    self.visible = ko.observable(true);
};

Flight = function(airlineCode, number, date, time, route) {
    var self = this;

    self.airlineCode = ko.observable(airlineCode);
    self.number = ko.observable(number);
    self.date = ko.observable(date);
    self.time = ko.observable(time);
    self.route = ko.observable(route);
};


AviaFilterModel = function(filterData) {
    var self = this;
    
    self.fromTimeStart = 0;
    self.fromTimeEnd = 24;
    self.toTimeStart = 0;
    self.toTimeEnd = 24;
    self.airlines = filterData.airlines;
    self.minFromTimeStart = filterData.minFromTimeStart;
    self.maxFromTimeEnd = filterData.maxFromTimeEnd;
    self.minToTimeStart = filterData.minToTimeStart;
    self.maxToTimeEnd = filterData.maxToTimeEnd;
};

$(function () {
    
    var model = new AviaProcessContainerModel();
    model.init();
    ko.applyBindings(model);
    
});