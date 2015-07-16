angular.module('cinemair.filters', [])

.filter('momentFormat', function() {
    return function(date, format) {
        return moment(date).format(format);
    };
})

.filter('fromNow', function() {
    return function(date, withoutSuffix) {
        var d = moment(date);
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
