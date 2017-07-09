
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

var formatCards = function(data) {
    out = '<ul class="col-lg-6 connectedSortable">';
    items = data.Items;
    for (var i=0; i<items.length; i++) {
        start = '<div class="box">';
        icon = '<img class="card-image" src="' + items[i][8] + '">';
        //icon = '<img src="' + items[i][8] + '">'
        mask = '<div class="card-mask"></div>'
        body = '<div class="card-content box-header">'
            + '<a class="card-title" href="https://store.steampowered.com/app/' + items[i][0] +'">' + items[i][1] + '</a>'
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
    $("#Library").removeClass('active');
    $("#Games").removeClass('active');
    $("#Discover").removeClass('active');

    $("#Title").text("Dashboard");

    $("#content").html("");
});

$("#Library").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Library").addClass('active');
    $("#Games").removeClass('active');
    $("#Discover").removeClass('active');

    $("#Title").text("Library");

    $.getJSON('http://97.79.174.132:5000/GetJoinedRowsOrdered', {
        email: 'rmkeezer@yahoo.com',
        password: 'smoothie42',
        table1: 'usergames',
        table2: 'games',
        numRows: '10',
        order: 'Id',
        dir: 'DESC'
    }, function(data) {
        out = formatCards(data);
        $("#content").html(out);
        refreshSortable();
    });

    $.getJSON('http://97.79.174.132:5000/GetRowsOrdered', {
        email: 'rmkeezer@yahoo.com',
        password: 'smoothie42',
        tableName: 'games',
        numRows: '10',
        order: 'Id',
        dir: 'DESC'
    }, function(data) {
        out = formatCards(data);
        $("#content").html($("#content").html() + out);
        refreshSortable();
    });
});

$("#Games").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Library").removeClass('active');
    $("#Games").addClass('active');
    $("#Discover").removeClass('active');

    $("#Title").text("Games");

    $.getJSON('http://97.79.174.132:5000/GetRows', {
        email: 'rmkeezer@yahoo.com',
        password: 'smoothie42',
        tableName: 'games',
        numRows: '10'
    }, function(data) {
        out = formatCards(data);
        $("#content").html(out);
        refreshSortable();
    });
});

$("#Discover").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Library").removeClass('active');
    $("#Games").removeClass('active');
    $("#Discover").addClass('active');

    $("#Title").text("Discover");

    $.getJSON('http://97.79.174.132:5000/GetXRandRows', {
        email: 'rmkeezer@yahoo.com',
        password: 'smoothie42',
        tableName: 'games',
        numRows: '10'
    }, function(data) {
        out = formatCards(data);
        $("#content").html(out);
        refreshSortable();
    });
});