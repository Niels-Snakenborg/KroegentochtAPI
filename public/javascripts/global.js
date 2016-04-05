$(document).ready(function() {

    // Populate the user table on initial page load
    populateRaceTables();
    populateUserTables();
    populateRaceCrudTables();

});

var isUpdate = false;
var userId;
var raceId;
var waypointId = "";

// Functions =============================================================

function populateRaceTables() {
    $('#tableRaces').empty();
    $('#tableRaces').append("<tr><th>Name</th><th>Description</th><th>Start</th><th>Status</th><th>View</th></tr>");

    // jQuery AJAX call for JSON
    $.getJSON( '/api/races', function( data ) {

        racesListData = data;

        $.each(data, function(){
            var tableContent = '';
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.description + '</td>';
            tableContent += '<td>' + this.start_date + '</td>';
            tableContent += '<td>' + this.status + '</td>';
            tableContent += '<td><a class="aButtonPlay" href="/race?raceid=' + this._id + '">view</a></td>';
            tableContent += '</tr>';

            $('#tableRaces tbody').append(tableContent);


        });

    });
};

function populateRaceCrudTables() {
    $('#tableRacesCrud').empty();
    $('#tableRacesCrud').append("<tr><th>Name</th><th>Description</th><th>Start</th><th>Status</th><th>Waypoints</th><th>Delete</th><th>Edit</th><th>actions</th></tr>");

    // jQuery AJAX call for JSON
    $.getJSON( '/api/races', function( data ) {

        racesListData = data;

        $.each(data, function(){
            var tableContent = '';
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.description + '</td>';
            tableContent += '<td>' + this.start_date + '</td>';
            tableContent += '<td>' + this.status + '</td>';
            tableContent += '<td><a raceid="' + this._id + '" class="aButtonWaypoints" href="#">waypoints</a></td>';
            tableContent += '<td><a raceid="' + this._id + '" class="aButtonDeleteRace" href="#">delete</a></td>';
            tableContent += '<td><a raceid="' + this._id + '" class="aButtonEditRace" href="#">edit</a></td>';
            tableContent += '<td><a raceid="' + this._id + '" class="aButtonRaceActions" href="#">actions</a></td>';
            tableContent += '</tr>';

            $('#tableRacesCrud tbody').append(tableContent);


        });

    });
};

function populateUserTables() {
    $('#tableUsers').empty();
    $('#tableUsers').append("<tr><th>Name</th><th>Role</th><th>Delete</th><th>Edit</th></tr>");
    // jQuery AJAX call for JSON
    $.getJSON( '/api/users', function( data ) {

        userListData = data;

        $.each(data, function(){
            var tableContent = '';
            tableContent += '<tr>';
            tableContent += '<td>' + this.username + '</td>';
            tableContent += '<td>' + this.role + '</td>';
            tableContent += '<td><a userid="' + this._id + '" class="aButtonDeleteUser" href="#">delete</a></td>';
            tableContent += '<td><a userid="' + this._id + '" class="aButtonEditUser" href="#">edit</a></td>';
            tableContent += '</tr>';

            $('#tableUsers tbody').append(tableContent);


        });

    });
};

$('#tableUsers').on('click', '.aButtonDeleteUser', function() {
    var id = $(this).attr('userid');

        $.ajax({
            url: '/api/users/' + id + '/delete',
            type: 'DELETE',
            success: function(result) {
                populateUserTables();
            }
        });
});

$('#tableRacesCrud').on('click', '.aButtonDeleteRace', function() {
    var id = $(this).attr('raceid');

    $.ajax({
        url: '/api/races/' + id + '/delete',
        type: 'DELETE',
        success: function(result) {
            populateRaceCrudTables();
        }
    });
});

$('#tableRacesCrud').on('click', '.aButtonWaypoints', function() {
    raceId = $(this).attr('raceid');
    loadWaypoints(raceId);
    $("#popupWaypoints").css("display", "block");
});

$('#tableUsers').on('click', '.aButtonEditUser', function() {
    isUpdate = true;
    userId = $(this).attr('userid');
    $("#popup").css("display", "block");
    $("#txtUsername").css("display", "none");
});

$('#tableRacesCrud').on('click', '.aButtonEditRace', function() {
    isUpdate = true;
    raceId = $(this).attr('raceid');
    fillRaceData(raceId);
    $("#popup").css("display", "block");
});



$("#tableRacesCrud").on('click', '.aButtonRaceActions', function() {
    raceId = $(this).attr('raceid');
    $("#popupActions").css("display", "block");
    loadWaypoints(raceId);
});

$("#imgAddUser").click(function(){
    isUpdate = false;
    $("#popup").css("display", "block");
});

$("#imgAddRace").click(function(){
    isUpdate = false;
    $("#popup").css("display", "block");
});

$("#sCancel").click(function(){
    $("#popup").css("display", "none");
});

$("#aCancel").click(function(){
    $("#popupWaypoints").css("display", "none");
});

$("#sCancelActions").click(function(){
    $("#popupActions").css("display", "none");
});

$("#aSaveUser").click(function(){
    var username = $("#txtUsername").val();
    var password = $("#txtPassword").val();
    var role = $("#txtRole option:selected").text();

    if(isUpdate){
        var DataToSend = new Object();
        DataToSend = {
            password : password,
            role : role
        };

        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: '/api/users/' + userId + '/update',
            data: JSON.stringify(DataToSend),
            dataType: "json",
            done: function (msg) {
            },
            error: function (err){

            }
        });
    }else{
        if(username != "" && password != "" && role != ""){
            $.post(
                "/api/users/add",
                { username: username, password: password, role: role},
                function(data) {
                    populateUserTables();
                    $("#popup").css("display", "none");
                }
            );
        }
    }

    $("#popup").css("display", "none");
    $("#txtUsername").css("display", "block");
    populateUserTables();
});

$("#aSaveRace").click(function(){
    var name = $("#txtName").val();
    var description = $("#txtDescription").val();
    var start_date =  $("#txtStartDate").val() + " " + $("#txtStartTime").val();

    if(isUpdate){
        var DataToSend = new Object();
        DataToSend = {
            name : name,
            description : description,
            start_date : start_date
        };

        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: '/api/races/' + raceId + '/update',
            data: JSON.stringify(DataToSend),
            dataType: "json",
            done: function (msg) {
            },
            error: function (err){

            }
        });
    }else{
        if(name != "" && description != "" && start_date != ""){
            $.post(
                "/api/races/add",
                { name: name, description: description, start_date: start_date, current_cafe: "", status: "Create", creator: $("#pUserId").text()},
                function(data) {
                }
            );
        }
    }

    populateRaceTables();
    $("#popup").css("display", "none");
});

$("#aSearch").click(function(){
    var long = $("#txtLong").val();
    var lat = $("#txtLat").val();
    var radius = $("#txtRadius").val();

    var url = '/api/waypoints/search?lat=' + lat + "&long=" + long + "&radius=" + radius;

    $.getJSON( url, function( data ) {
        $('#txtSelectedWaypoint').empty();
        $.each(data.results, function(){
            $('#txtSelectedWaypoint').append("<option value='" + this.place_id + "'>" + this.name + "</option>");

        });

    });
});

$("#aAddWaypoint").click(function(){
    var place_id = $("#txtSelectedWaypoint").val();

    if(place_id != ""){
        $.post(
            "/api/waypoints/add/" + place_id,
            { race: raceId},
            function(data) {
                loadWaypoints(raceId);
            }
        );
    }

});

function loadWaypoints(raceId){
    loadCurrentCafe(raceId);
    $("#tableWaypoints").empty();
    $("#tableWaypoints").append("<tr><th>Name</th><th>Delete</th></tr>");

    $("#txtCurrentCafe").empty();

    $.getJSON( '/api/waypoints/race/' + raceId, function( data ) {


        $.each(data, function(){

            $('#tableWaypoints tbody').append("<tr><td>" + this.name + "</td><td><a waypointid='" + this._id + "' class='aButtonDelteWaypoint' href='#'>delete</a></td></tr>");

            if(this._id == waypointId)
                $("#txtCurrentCafe").append("<option selected value='" + this._id + "'>" + this.name + "</option>");
            else
                $("#txtCurrentCafe").append("<option value='" + this._id + "'>" + this.name + "</option>");
        });

    });
}

$("#tableWaypoints").on('click', '.aButtonDelteWaypoint', function() {
    id = $(this).attr('waypointid');
    $.ajax({
        url: '/api/waypoints/' + id + '/delete',
        type: 'DELETE',
        success: function(result) {
        }
    });

    loadWaypoints(raceId);
});

$("#aSaveCurrentRace").click(function(){
    var cafe = $("#txtCurrentCafe").val();
    if(cafe != ""){
        var DataToSend = new Object();
        DataToSend = {
            current_cafe : cafe
        };

        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: '/api/races/' + raceId + '/set_currentcafe',
            data: JSON.stringify(DataToSend),
            dataType: "json",
            done: function (msg) {
            },
            error: function (err){

            }
        });
        $("#popupActions").css("display", "none");
    }
});

function loadCurrentCafe(raceId){
    $.getJSON( '/api/races/' + raceId + "/currentcafe", function( data ) {
        waypointId = data;
    });
}

$("#aStartRace").click(function(){
    editStatus("Active");
});

$("#aEndRace").click(function(){
    editStatus("Ended");
});

$("#aReadyRace").click(function(){
    editStatus("Ready");
});



function editStatus(status){

    var DataToSend = new Object();
    DataToSend = {
        status : status
    };
    $.ajax({
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        url: '/api/races/' + raceId + '/status',
        data: JSON.stringify(DataToSend),
        dataType: "json",
        done: function (msg) {
        },
        error: function (err){

        }
    });
    $("#popupActions").css("display", "none");
}

function fillRaceData(raceId){
    $.getJSON( '/api/races/' + raceId, function( data ) {
        $("#txtName").val(data.name);
        $("#txtDescription").val(data.description);
    });
}