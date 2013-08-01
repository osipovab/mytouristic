﻿
AviaProcessContainerModel = function() {
    var self = this;
    
    self.aviaFormModel = new AviaFormModel();
    self.aviaPriceModel = new AviaPriceModel();
    self.aviaScheduleModel = new AviaScheduleModel();
    self.aviaFilterModel = new AviaFilterModel();
    
    self.init = function () {
        self.aviaFormModel.init();
    };
    self.search = function () {
        if (self.aviaFormModel.searchType() == "byPrice") {
            self.aviaPriceModel.search();
        } else {
            self.aviaScheduleModel.search();
        }
    };

    self.reset = function() {
        self.aviaPriceModel = new AviaPriceModel();
        self.aviaScheduleModel = new AviaScheduleModel();
    };

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
    };
    
    function loadCities() {
        $.ajax({
            url: "api/City",
            success: function (result) { self.cities(result); },
            error: function () { self.error("Ошибка при загрузке списка городов"); }
        });
    }

};


AviaPriceModel = function () {
    var self = this;

    self.offers = ko.observableArray([]);
    
    self.search = function () {
        //, "toCity": $('toCity').val(), "fromDate": $('fromDate').val(), "toDate": $('toDate').val() },
        $.ajax({
            url: "api/Search/SearchByPrice",
            dataType: 'json',
            data: { "fromCity": $('fromCity').val()},
            success: function (result) {
                $.each(result, function (index, offer) {
                    var flights = [];
                    $.each(offer.Flights, function(index, flight) {
                        flights.push(new Flight(flight.AirlineCode,flight.Number, flight.Date, ""));
                    });
                    self.offers.push(new Offer(flights, offer.Price));
                });
            },
            error: function() { alert("Ошибка при поиске по цене"); }
        });
    };
};


AviaScheduleModel = function() {
    var self = this;
    
    self.offers = ko.observableArray([]);
    
    self.search = function() {
        $.ajax({
            url: "api/Search/SearchBySchedule",
            data: { },
            success: function(result) {
                self.offers(result);
            },
            error: function () { alert("Ошибка при поиске расписанию"); }
        });
    };

};



AviaFilterModel  = function () {
    var self = this;
    self.timeFromStart = ko.observable("0");
    self.timeFromEnd = ko.observable("24");
    self.timeToStart = ko.observable("0");
    self.timeToEnd = ko.observable("24");

};


Offer = function(flights, price) {
    var self = this;

    self.flights = ko.observableArray(flights);
    self.price = ko.observable(price);
};

Flight = function(airlineCode, number, date, route) {
    var self = this;

    self.airlineCode = ko.observable(airlineCode);
    self.number = ko.observable(number);
    self.date = ko.observable(date);
    self.route = ko.observable(route);
};


$(function () {
    
    var model = new AviaProcessContainerModel();
    model.init();
    ko.applyBindings(model);
    
});