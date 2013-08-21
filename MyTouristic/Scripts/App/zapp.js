
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
        $('#dim').css('display', 'block');
        
        self.aviaFilterModel(null);
        //if (self.validation()) {
        if (self.aviaFormModel.searchType() == "byPrice") {
                var fDate = self.aviaFormModel.fromDate().getFullYear() + '-' + (self.aviaFormModel.fromDate().getMonth() + 1) + '-' + self.aviaFormModel.fromDate().getDate();
                var tDate = self.aviaFormModel.toDate().getFullYear() + '-' + (self.aviaFormModel.toDate().getMonth() + 1) + '-' + self.aviaFormModel.toDate().getDate();
                self.aviaPriceModel.search(self.aviaFormModel.fromCity(), self.aviaFormModel.toCity(), fDate, tDate, self.updateFilter);
                self.aviaScheduleModel = new AviaScheduleModel();
        } else {
                var fDate = self.aviaFormModel.fromDate().getFullYear() + '-' + (self.aviaFormModel.fromDate().getMonth() + 1) + '-' + self.aviaFormModel.fromDate().getDate();
                var tDate = self.aviaFormModel.toDate().getFullYear() + '-' + (self.aviaFormModel.toDate().getMonth() + 1) + '-' + self.aviaFormModel.toDate().getDate();
                self.aviaScheduleModel.search(self.aviaFormModel.fromCity(), self.aviaFormModel.toCity(), fDate, tDate, self.updateFilter);
                self.aviaPriceModel = new AviaPriceModel();
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

    self.filteredFlightsFrom = ko.computed(function() {
        if (!self.aviaFilterModel()) {
            return self.aviaScheduleModel.flightFrom();
        }
        var flightFrom = [];

        $.each(self.aviaScheduleModel.flightFrom(), function (index, flight) {
            var visible = true;
            $.each(self.aviaFilterModel().airlines(), function (index, airline) {
                if (flight.airlineCode() === airline.code() && !airline.checked()) {
                    visible = false;
                }
            });
            
            if (parseInt(flight.time().substring(0, 2)) <= self.aviaFilterModel().fromTimeStart()) {
                visible = false;
            }

            if (parseInt(flight.time().substring(0, 2)) >= self.aviaFilterModel().fromTimeEnd()) {
                visible = false;
            }
            
            if (visible) {
                if (flightFrom.indexOf(flight) < 0) {
                    flightFrom.push(flight);
                }
            }
        });
        return flightFrom;
    });
    
    self.filteredFlightsTo = ko.computed(function () {
        if (!self.aviaFilterModel()) {
            return self.aviaScheduleModel.flightTo();
        }
        var flightTo = [];

        $.each(self.aviaScheduleModel.flightTo(), function (index, flight) {
            var visible = true;
            $.each(self.aviaFilterModel().airlines(), function (index, airline) {
                if (flight.airlineCode() === airline.code() && !airline.checked()) {
                    visible = false;
                }
            });

            if (parseInt(flight.time().substring(0, 2)) <= self.aviaFilterModel().toTimeStart()) {
                visible = false;
            }

            if (parseInt(flight.time().substring(0, 2)) >= self.aviaFilterModel().toTimeEnd()) {
                visible = false;
            }

            if (visible) {
                if (flightTo.indexOf(flight) < 0) {
                    flightTo.push(flight);
                }
            }
        });
        return flightTo;
    });

    self.filteredOffers = ko.computed(function () {
        if (!self.aviaFilterModel()) {
            return self.aviaPriceModel.offers();
        }
        var offers = [];
        $.each(self.aviaPriceModel.offers(), function (index, offer) {
            var visibleOffer = true;
            $.each(offer.flights(), function (index, flight) {
                $.each(self.aviaFilterModel().airlines(), function (index, airline) {
                    if (flight.airlineCode() === airline.code() && !airline.checked()) {
                        visibleOffer = false;
                    } 
                });
            });
            
            if (parseInt(offer.flights()[0].time().substring(0, 2)) < self.aviaFilterModel().fromTimeStart() ) {
                visibleOffer = false;
            }
            
            if (parseInt(offer.flights()[0].time().substring(0, 2)) >= self.aviaFilterModel().fromTimeEnd()) {
                visibleOffer = false;
            }

            if (parseInt(offer.flights()[1].time().substring(0, 2)) < self.aviaFilterModel().toTimeStart()) {
                visibleOffer = false;
            }

            if (parseInt(offer.flights()[1].time().substring(0, 2)) >= self.aviaFilterModel().toTimeEnd()) {
                visibleOffer = false;
            }

            if (visibleOffer) {
                if (offers.indexOf(offer) < 0) {
                    offers.push(offer);
                }
            }
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

    var delay = 3000;
    
    self.search = function (fromCity, toCity, fromDate, toDate, callback) {
        self.offers.removeAll();

        $.ajax({
            url: "api/Search/SearchByPrice",
            dataType: 'json',
            data: ({ 'fromCity': fromCity, 'toCity': toCity, 'fromDate': fromDate, 'toDate': toDate })
        }).done(function (result) {
            self.offers.removeAll();
            setTimeout(function() {
                var filterData = {
                    airlines: [],
                    minFromTimeStart: null,
                    maxFromTimeEnd: null,
                    minToTimeStart: null,
                    maxToTimeEnd: null
                };

                $.each(result, function(index, offer) {
                    var flights = [];
                    $.each(offer.Flights, function(index, flight) {
                        flights.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                        if (_.some(filterData.airlines, function(airline) { return airline.code == flight.AirlineCode; }) == false) {
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
        }).always(function() {
            setTimeout(function() {
                $('#dim').css('display', 'none');
            }, delay);
        }).fail(function() { alert("Ошибка при поиске по цене"); });
    };
};


AviaScheduleModel = function() {
    var self = this;
    
    self.flightFrom = ko.observableArray([]);
    self.flightTo = ko.observableArray([]);

    var delay = 3000;
    
    self.search = function (fromCity, toCity, fromDate, toDate, callback) {
        $.ajax({
            url: "api/Search/SearchBySchedule",
            dataType: 'json',
            data: ({ 'fromCity': fromCity, 'toCity': toCity, 'fromDate': fromDate, 'toDate': toDate })
        }).done(function(result) {
            self.flightFrom.removeAll();
            self.flightTo.removeAll();

            setTimeout(function() {
                var filterData = {
                    airlines: [],
                    minFromTimeStart: null,
                    maxFromTimeEnd: null,
                    minToTimeStart: null,
                    maxToTimeEnd: null
                };
                $.each(result[0].Flights, function(index, flight) {
                    self.flightFrom.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                    if (_.some(filterData.airlines, function(airline) { return airline.code == flight.AirlineCode; }) == false) {
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
                $.each(result[1].Flights, function(index, flight) {
                    self.flightTo.push(new Flight(flight.AirlineCode, flight.Number, moment(flight.Date).format('DD.MM.YYYY'), moment(flight.Date).format('HH:mm'), flight.Route));
                    if (_.some(filterData.airlines, function(airline) { return airline.code == flight.AirlineCode; }) == false) {
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
        }).fail(function() {
            alert("Ошибка при поиске расписанию");
        }).always(function() {
            setTimeout(function() {
                $('#dim').css('display', 'none');
            }, delay);
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
    
    self.airlines = filterData.airlines;
    
    self.fromTimeStart = ko.observable(filterData.minFromTimeStart);
    self.fromTimeEnd = ko.observable(filterData.maxFromTimeEnd);
    self.toTimeStart = ko.observable(filterData.minToTimeStart);
    self.toTimeEnd = ko.observable(filterData.maxToTimeEnd);
    
    self.minFromTimeStart = filterData.minFromTimeStart;
    self.maxFromTimeEnd = filterData.maxFromTimeEnd;
    self.minToTimeStart = filterData.minToTimeStart;
    self.maxToTimeEnd = filterData.maxToTimeEnd;

    self.fromTimeStartFull = ko.computed(function () {
        return fullHourFormat(self.fromTimeStart());
    });
    
    self.fromTimeEndFull = ko.computed(function () {
        return fullHourFormat(self.fromTimeEnd());
    });
    
    self.toTimeStartFull = ko.computed(function () {
        return fullHourFormat(self.toTimeStart());
    });
    
    self.toTimeEndFull = ko.computed(function () {
        return fullHourFormat(self.toTimeEnd());
    });


    function fullHourFormat(hour) {
        if (hour > 9) return hour;
        else return "0" + hour;
    }

};

$(function () {
    
    var model = new AviaProcessContainerModel();
    model.init();
    ko.applyBindings(model);
    
});