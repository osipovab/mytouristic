Flight = function (airlineCode, number, date, time, route) {
    var self = this;

    self.airlineCode = ko.observable(airlineCode);
    self.number = ko.observable(number);
    self.date = ko.observable(date);
    self.time = ko.observable(time);
    self.route = ko.observable(route);
};