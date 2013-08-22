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
                self.toCity(result[0]);
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
