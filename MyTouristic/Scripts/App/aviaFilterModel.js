AviaFilterModel = function (filterData) {
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
