currentUser_id = '1';
oldMyGames = [];

var refreshSortable = function(id) {
    $(".connectedSortable").sortable({
        placeholder: "sort-highlight",
        connectWith: ".connectedSortable",
        handle: ".box-header",
        forcePlaceholderSize: true,
        zIndex: 999999
    });
    $('#mygames').bind("DOMSubtreeModified",function() {
        ids = $.map($(this).find(".card-id"), function (div) {
            return div.innerHTML
        });
        if (Math.abs(oldMyGames.length-ids.length) == 1) {
            let a = new Set(oldMyGames);
            let b = new Set(ids);
            var id = [...b].filter(x => !a.has(x))[0];
            if (id) {
                $.post('http://127.0.0.1:5000/AddGame', {
                    email: 'rmkeezer@yahoo.com',
                    password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
                    userId: currentUser_id,
                    gameId: id
                }, function(data) {
                    console.log(data);
                }, 'json');
            } else {
                id = [...a].filter(x => !b.has(x))[0];
                $.post('http://127.0.0.1:5000/RemoveGame', {
                    email: 'rmkeezer@yahoo.com',
                    password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
                    userId: currentUser_id,
                    gameId: id,
                }, function(data) {
                    console.log(data);
                }, 'json');
            }
            oldMyGames = ids;
        }
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

var loadingCircle = function() {
    return '<div class="sk-circle">\
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
}

var createSection = function(id, name) {
    out = '<div class="col-lg-6">'
    out += '<h1>' + name + '</h1>'
    out += '<div style="width: 100%">'
    out += '<div class="order"><select class="form-control" id="order' + id + '">\
                <option value="metacritic DESC">Metacritic (desc)</option>\
                <option value="metacritic ASC">Metacritic (asc)</option>\
            </select></div>'
    out += '<div class="order"><select class="form-control" id="filter' + id + '">\
                <option value="">Metacritic (desc)</option>\
                <option value="">Metacritic (asc)</option>\
            </select></div>'
    out += '</div>'
    out += '<div class="connectedSortable" id="' + id + '">';
    out += loadingCircle();
    out += '</div>';
    out += '<div class="centered">'
    out += '<a class="button btn btn-block btn-default" id="prev' + id + '">Prev</a>'
    out += '<a class="button btn btn-block btn-default" id="next' + id + '">Next</a>'
    out += '</div>'
    out += '</div>'
    return out;
}

var formatCards = function(data, name) {
    items = data.Items;
    out = '';
    for (var i=0; i<items.length; i++) {
        start = '<div class="box">';
        id = '<div class="card-id" hidden="True">' + items[i][0] + '</div>';
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
        out += start + id + icon + mask + body + metacritic + end;
    }
    return out;
}

var createPage = function(data, start, end, id, name, pageListener) {
    out = formatCards(data, name);
    $("#" + id).html(out);
    refreshSortable(id);
    var order = $("#order" + id).val().split(' ');
    var filter = $("#filter" + id).val().split(' ');
    $("#next" + id).unbind('click');
    $("#next" + id).click(function(e) {
        $("#" + id).html(loadingCircle());
        pageListener(start + end, end, id, name, order[0], order[1], filter[0], filter[1]);
    });
    $("#prev" + id).unbind('click');
    $("#prev" + id).click(function(e) {
        if (start > 0) {
            $("#" + id).html(loadingCircle());
            pageListener(start - end, end, id, name, order[0], order[1], filter[0], filter[1]);
        }
    });
    $("#order" + id).unbind('change');
    $("#order" + id).on('change', function() {
        $("#" + id).html(loadingCircle());
        var order = this.value.split(' ');
        pageListener(start, end, id, name, order[0], order[1], filter[0], filter[1]);
    });
}

var getOtherGames = function(start, end, id, name, order='metacritic', dir='DESC', names='', vals='') {
    $.getJSON('http://127.0.0.1:5000/GetOtherGames', {
        email: 'rmkeezer@yahoo.com',
        password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
        whereNames: names,
        whereVals: vals,
        offset: start.toString(),
        numRows: end.toString(),
        order: order,
        dir: dir
    }, function(data) {
        console.log(data);
        cutData(data, 2);
        createPage(data, start, end, id, name, getOtherGames);
    });
}

var getMyGames = function(start, end, id, name, order='metacritic', dir='DESC', names='', vals='') {
    $.getJSON('http://127.0.0.1:5000/GetMyGames', {
        email: 'rmkeezer@yahoo.com',
        password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
        whereNames: names,
        whereVals: vals,
        offset: start.toString(),
        numRows: end.toString(),
        order: order,
        dir: dir
    }, function(data) {
        console.log(data);
        cutData(data, 2);
        oldMyGames = data.Items.map(function(x) { return x[0].toString() });
        createPage(data, start, end, id, name, getMyGames);
    });
}

var getGames = function(start, end, id, name, order='metacritic', dir='DESC', names='', vals='') {
    $.getJSON('http://127.0.0.1:5000/GetAllGames', {
        email: 'rmkeezer@yahoo.com',
        password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
        whereNames: names,
        whereVals: vals,
        offset: start.toString(),
        numRows: end.toString(),
        order: order,
        dir: dir
    }, function(data) {
        console.log(data);
        createPage(data, start, end, id, name, getGames);
    });
}

var getRandomGames = function(start, end, id, name, names='', vals='') {
    $.getJSON('http://127.0.0.1:5000/GetRandGames', {
        email: 'rmkeezer@yahoo.com',
        password: '2A459254CB7C141920285242B47E01722AAE4A0D2945F53E45CE4E9BD743E841493FFEFAE15767AC0287F9C695566AC98ED4A38A65EF65649B0938A53A533971',
        whereNames: names,
        whereVals: vals,
        numRows: end.toString()
    }, function(data) {
        console.log(data);
        createPage(data, start, end, id, name, getRandomGames);
    });
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

    getMyGames(0, 10, sec1Id, 'My Games');

    getOtherGames(0, 10, sec2Id, 'Other Games');
});

$("#Games").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Library").removeClass('active');
    $("#Games").addClass('active');
    $("#Discover").removeClass('active');

    var sec1Id = 'games'
    var sec1 = createSection(sec1Id, 'All Games');
    
    $("#content").html(sec1);

    getGames(0, 10, sec1Id, 'All Games');
});

$("#Discover").click(function(e) {
    $("#Dashboard").removeClass('active');
    $("#Library").removeClass('active');
    $("#Games").removeClass('active');
    $("#Discover").addClass('active');

    var sec1Id = 'random'
    var sec1 = createSection(sec1Id, 'Random Games');
    
    $("#content").html(sec1);

    getRandomGames(0, 10, sec1Id, 'Random Games');
});