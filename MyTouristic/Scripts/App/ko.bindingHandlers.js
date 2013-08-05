
//ko.bindingHandlers.datepicker = {
//    init: function(element) {
//        $(element).datepicker({
//            minDate: new Date(),
//            dateFormat: 'dd.mm.yy',
//            defaultDate: 'Now'
//        });
//        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
//            $(element).datepicker("destroy");
//        });
//    }
//};

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker({
            dateFormat: 'dd.mm.yy'
        });

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).datepicker("getDate"));
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        //handle date data coming via json from Microsoft
        if (String(value).indexOf('/Date(') == 0) {
            value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
        }

        var current = $(element).datepicker("getDate");

        if (value - current !== 0) {
            $(element).datepicker("setDate", value);
        }
    }
};

ko.bindingHandlers.rangeSlider = {
    update: function (element, valueAccessor) {
        var options = valueAccessor() || {};
        $(element).children("div.slider").slider({
            range: true,
            min: options.minFrom,
            max: options.maxTo,
            values: [options.from, options.to],
            slide: function (event, ui) {
                $(element).children("input.rangeSliderFrom").val(ui.values[0]).change();
                $(element).children("input.rangeSliderTo").val(ui.values[1]).change();
            }
        });
    }
};

