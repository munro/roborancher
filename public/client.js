function hasSession() {
    return ($.cookie('authenticated') == 'true');
};

function showLogin() {
    $('#connecting').hide();
    $('#login').show();
    $('#game').hide();
}

function showGame() {
    $('#welcome').html('Welcome ' + $.cookie('username') + '!');

    $('#connecting').hide();
    $('#login').hide();
    $('#game').show();
}

function logout() {
    $.cookie('authenticated', null);
    window.location.reload();
}

$(document).ready(function() {
    if (!hasSession()) {
        showLogin();
    } else {
        showGame();
    }

    $('#logout').click(function() {
        logout();
    });
});