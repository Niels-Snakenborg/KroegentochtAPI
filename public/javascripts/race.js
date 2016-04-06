var RACEID;
var CURRENTCAFE;
var SOCKET;

$(document).ready(function() {

    RACEID = $("#pRaceId").text();

    if(RACEID != ""){
        populateCafeTable();
    }

    SOCKET = io.connect("https://localhost");
    SOCKET.on('RaceUpdate', function (data) {
        RACEID = data.id;
        populateCafeTable();
        populateInfo();
    })
    SOCKET.on('CheckinUpdate', function (data) {
        CURRENTCAFE = data.id;
        populateCheckinTable();
    })
});

function populateCafeTable(){
    $('#tableWaypointsRace').empty();
    $('#tableWaypointsRace').append("<tr><th></th><th>Name</th><th>Adress</th><th>Current</th></tr>");

    $.getJSON( '/api/races/' + RACEID + "/currentCafe", function( data ) {
        CURRENTCAFE = data;
        getWaypoints();
        populateCheckinTable();
    });
}

function populateCheckinTable(){
    $('#tableCheckIns').empty();
    $('#tableCheckIns').append("<tr><th>User</th><th>Date</th></tr>");

    getCheckins();
}

function getWaypoints(){
    $.getJSON( '/api/waypoints/race/' + RACEID, function( data ) {

        $.each(data, function () {
            var tableContent = '';
            tableContent += '<tr>';
            tableContent += '<td><img class="imgBeer" src="/images/beer.png"/></td>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.adress + '</td>';

            if(CURRENTCAFE == this._id)
                tableContent += '<td class="tdCurrentCafe"><img src="/images/current.png"/></td>';
            else
                tableContent += '<td class="tdCurrentCafe"></td>';

            tableContent += '</tr>';

            $('#tableWaypointsRace tbody').append(tableContent);

        });
    });
}

function getCheckins(){
    $.getJSON( '/api/checkins/waypoint/' + CURRENTCAFE, function( data ) {

        $.each(data, function () {
            var tableContent = '';
            tableContent += '<tr>';
            tableContent += '<td>' + this.username + '</td>';
            tableContent += '<td>' + this.date + '</td>';
            tableContent += '</tr>';

            $('#tableCheckIns tbody').append(tableContent);

        });
    });
}

function populateInfo(){
    $.getJSON( '/api/races/' + RACEID, function( data ) {
        $("#pRaceDescription").text(data.description);
        $("#pRaceStart").text(data.start_date);
        $("#pRaceStatus").text(data.status);
    });
}

$("#aCheckin").click(function(){
    $.post(
        "/api/checkins/add",
        { username: $("#pUser").text(), userid: $("#pUserId").text(), waypoint: CURRENTCAFE},
        function(data) {

        }
    );
});
