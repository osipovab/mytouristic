
Offer = function (flights, price) {
    var self = this;

    self.flights = ko.observableArray(flights);
    self.price = ko.observable(price);
    self.visible = ko.observable(true);
};
