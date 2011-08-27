require({
    paths: {
        'events': '../../js/events'
    },
    urlArgs: 'bust=' + (new Date()).getTime()
}, ['events'], function (events) {
    var html = '';
    for (var x = 0; x < 20; x += 1) {
        for (var y = 0; y < 10; y += 1) {
            var tile_x = x * 45, tile_y = y * 45;
            html += '<div style="margin-left:' + tile_x + 'px;margin-top:' +
                    tile_y + 'px"></div>';
        }
    }
    $('#board').html(html);
    console.log('main!!!', events);
});
