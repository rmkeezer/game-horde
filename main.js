
var refreshSortable = function(id) {
    $(".connectedSortable").sortable({
        placeholder: "sort-highlight",
        connectWith: ".connectedSortable",
        handle: ".box-header",
        forcePlaceholderSize: true,
        zIndex: 999999
    });
    $('.connectedSortable .box-header').css('cursor', 'move');
    $('#' + id).find('.sk-circle').hide();
}
refreshSortable();

var cutData = function(data, start) {
    for (var i=0; i<data.Items.length; i++) {
        data.Items[i] = data.Items[i].slice(start);
    }
}

var createSection = function(id, name) {
    out = '<div class="col-lg-6 connectedSortable" id="' + id + '">';
    out += '<h1>' + name + '</h1>'
    out += '<div class="sk-circle">\
                <div class="sk-circle1 sk-child"></div>\
                <div class="sk-circle2 sk-child"></div>\
                <div class="sk-circle3 sk-child"></div>\
                <div class="sk-circle4 sk-child"></div>\
                <div class="sk-circle5 sk-child"></div>\
                <div class="sk-circle6 sk-child"></div>\
                <div class="sk-circle7 sk-child"></div>\
                <div class="sk-circle8 sk-child"></div>\
                <div class="sk-circle9 sk-child"></div>\
                <div class="sk-circle10 sk-child"></div>\
                <div class="sk-circle11 sk-child"></div>\
                <div class="sk-circle12 sk-child"></div>\
            </div>'
    out += '</div>';
    return out;
}

var formatCards = function(data, name) {
    items = data.Items;
    out = '<h1>' + name + '</h1>';
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
    return out;
}

$("#Dashboard").click(function(e) {
    $("#Dashboard").addClass('active');
    $("#Library").removeClass('active');
    $("#Games").removeClass('active');
    $("#Discover").removeClass('active');

    $("#content").html("");
});

$("#Library").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Library").addClass('active');
    $("#Games").removeClass('active');
    $("#Discover").removeClass('active');

    $('.sk-circle').show();
    
    var sec1Id = 'mygames'
    var sec2Id = 'other'
    var sec1 = createSection(sec1Id, 'My Games');
    var sec2 = createSection(sec2Id, 'Other Games');
    
    $("#content").html(sec1 + sec2);

    $.getJSON('http://97.79.174.131:5000/GetJoinedRowsOrdered', {
        email: 'rmkeezer@yahoo.com',
        password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
        table1: 'usergames',
        table2: 'games',
        join1: 'game_id',
        join2: 'Id',
        joinType: 'INNER',
        null: 'user_id',
        neg: 'NOT',
        offset: '0',
        numRows: '10',
        order: 'metacritic',
        dir: 'DESC'
    }, function(data) {
        cutData(data, 2);
        out = formatCards(data, 'My Games');
        $("#" + sec1Id).html(out);
        refreshSortable(sec1Id);
    });

    $.getJSON('http://97.79.174.131:5000/GetJoinedRowsOrdered', {
        email: 'rmkeezer@yahoo.com',
        password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
        table1: 'usergames',
        table2: 'games',
        join1: 'game_id',
        join2: 'Id',
        joinType: 'RIGHT',
        null: 'user_id',
        neg: '',
        offset: '0',
        numRows: '10',
        order: 'metacritic',
        dir: 'DESC'
    }, function(data) {
        cutData(data, 2);
        out = formatCards(data, 'Other Games');
        $("#" + sec2Id).html(out);
        refreshSortable(sec2Id);
    });
});

$("#Games").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Library").removeClass('active');
    $("#Games").addClass('active');
    $("#Discover").removeClass('active');

    var sec1Id = 'games'
    var sec1 = createSection(sec1Id, 'All Games');
    
    $("#content").html(sec1);

    $.getJSON('http://97.79.174.131:5000/GetRows', {
        email: 'rmkeezer@yahoo.com',
        password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
        tableName: 'games',
        offset: '0',
        numRows: '10'
    }, function(data) {
        out = formatCards(data, 'All Games');
        $("#" + sec1Id).html(out);
        refreshSortable(sec1Id);
    });
});

$("#Discover").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Library").removeClass('active');
    $("#Games").removeClass('active');
    $("#Discover").addClass('active');

    var sec1Id = 'random'
    var sec1 = createSection(sec1Id, 'Random Games');
    
    $("#content").html(sec1);

    $.getJSON('http://97.79.174.131:5000/GetXRandRows', {
        email: 'rmkeezer@yahoo.com',
        password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
        tableName: 'games',
        offset: '0',
        numRows: '10'
    }, function(data) {
        out = formatCards(data, 'Random Games');
        $("#" + sec1Id).html(out);
        refreshSortable(sec1Id);
    });
});