
ko.bindingHandlers.datepicker = {
    init: function(element) {
        $(element).datepicker({
            minDate: new Date()
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).datepicker("destroy");
        });
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

