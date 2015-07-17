angular.module('cinemair.filters', [])

.filter('momentFormat', function() {
    return function(datetime, format) {
        return moment(datetime).format(format);
    };
})

.filter('fromNow', function() {
    return function(datetime, withoutSuffix) {
        var d = moment(datetime);
        if (moment().isBefore(d)) {
            return d.fromNow(withoutSuffix || false);
        } else {
            return d.toNow(withoutSuffix || false);
        }
    };
})

.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
})

.filter('rangeInvert', function() {
    return function(input, total) {
        total = 10 - parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
})
