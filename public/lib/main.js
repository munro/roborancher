require({
    paths: {
        'events': '../js/events'
    },
    urlArgs: 'bust=' + (new Date()).getTime()
}, ['events'], function (events) {
    console.log('main!!!', events);
});
