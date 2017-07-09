
var refreshSortable = function() {
    $(".connectedSortable").sortable({
        placeholder: "sort-highlight",
        connectWith: ".connectedSortable",
        handle: ".box-header",
        forcePlaceholderSize: true,
        zIndex: 999999
    });
    $('.connectedSortable .box-header, .connectedSortable').css('cursor', 'move');
}
refreshSortable();

var formatCards = function(data, num) {
    out = '<ul class="col-lg-6 connectedSortable">';
    items = data.Items;
    for (var i=0; i<num; i++) {
        start = '<div class="box">';
        icon = '<img class="card-image" src="' + items[i][8] + '">';
        //icon = '<img src="' + items[i][8] + '">'
        mask = '<div class="card-mask"></div>'
        body = '<div class="card-content box-header">'
            + '<a class="card-title" href="#">' + items[i][1] + '</a>'
            + '<div class="card-text">' + items[i][18] + '</div>'
            + '</div>';
        if (items[i][16] == '0') {
            metacritic = '';
        } else {
            metacritic = '<div class="card-meta">'
                        + '<div class="card-meta-text" href="' + items[i][17] + '">' + items[i][16] + '</div>'
                        + '</div>';
        }
        end = '</div>';
        out += start + icon + mask + body + metacritic + end;
    }
    out += '';
    return out;
}

$("#Dashboard").click(function(e) {
    $("#Dashboard").addClass('active');
    $("#Games").removeClass('active');
    $("#Discover").removeClass('active');

    $("#Title").text("Dashboard");

    $("#content").html("");
});

$("#Games").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Games").addClass('active');
    $("#Discover").removeClass('active');

    $("#Title").text("Games");

    $.getJSON('http://97.79.174.132:5000/GetAllRows', {
        email: 'rmkeezer@yahoo.com',
        password: 'smoothie42',
        tableName: 'games'
    }, function(data) {
        out = formatCards(data, 10);
        $("#content").html(out);
        refreshSortable();
    });
});

$("#Discover").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Games").removeClass('active');
    $("#Discover").addClass('active');

    $("#Title").text("Discover");

    $.getJSON('http://97.79.174.132:5000/GetXRandRows', {
        email: 'rmkeezer@yahoo.com',
        password: 'smoothie42',
        tableName: 'games',
        numRows: '10'
    }, function(data) {
        out = formatCards(data, 10);
        $("#content").html(out);
        refreshSortable();
    });
});