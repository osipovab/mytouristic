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
        if (self.validation()) {

            $('#dim').css('display', 'block');
            var fDate = self.aviaFormModel.fromDate().getFullYear() + '-' + (self.aviaFormModel.fromDate().getMonth() + 1) + '-' + self.aviaFormModel.fromDate().getDate();
            var tDate = self.aviaFormModel.toDate().getFullYear() + '-' + (self.aviaFormModel.toDate().getMonth() + 1) + '-' + self.aviaFormModel.toDate().getDate();

            if (self.aviaFormModel.searchType() == "byPrice") {
                self.aviaPriceModel.search(self.aviaFormModel.fromCity(), self.aviaFormModel.toCity(), fDate, tDate, self.updateFilter);
            } else {
                self.aviaScheduleModel.search(self.aviaFormModel.fromCity(), self.aviaFormModel.toCity(), fDate, tDate, self.updateFilter);
                self.aviaScheduleModel.routeFrom(self.aviaFormModel.fromCity() + ' - ' + self.aviaFormModel.toCity() + ' ' + moment(fDate).format('DD.MM.YYYY'));
                self.aviaScheduleModel.routeTo(self.aviaFormModel.toCity() + ' - ' + self.aviaFormModel.fromCity() + ' ' + moment(tDate).format('DD.MM.YYYY'));
            }
        }
    };

    self.reset = function () {
        self.aviaPriceModel.offers.removeAll();
        self.aviaScheduleModel.flightFrom.removeAll();
        self.aviaScheduleModel.flightTo.removeAll();
    };

    self.updateFilter = function (filter) {
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
    
    self.validation = function () {
        var errorString = "";
        if (self.aviaFormModel.fromCity() == self.aviaFormModel.toCity())
            errorString += "Пункт вылета не должен совпадать с пунктом прилета";

        var myDate = new Date();
        myDate.setDate(myDate.getDate() - 1);

        if (myDate > self.aviaFormModel.fromDate())
            errorString += "\nДата вылета не может быть больше сегодняшнего дня";
        if (self.aviaFormModel.fromDate() > self.aviaFormModel.toDate())
            errorString += "\nДата вылета не может быть больше даты возвращения";

        if (errorString.length > 1) { alert(errorString); return false; } else { return true; }
    };

};


$(function () {
    var model = new AviaProcessContainerModel();
    model.init();
    ko.applyBindings(model);
});