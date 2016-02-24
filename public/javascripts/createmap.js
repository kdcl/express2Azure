var myData;
var selectlists = new Array();
var selectlists_name = new Array();
var sendData={"first":"ian","second":"elliot","id":27};
function initialize() {
        var latitude = 25.048079,
            longitude = 121.517080,
            //radius = 8000, //how is this set up
            center = new google.maps.LatLng(latitude,longitude),

            //bounds = new google.maps.Circle({center: center, radius: radius}).getBounds(),
            mapOptions = {
                center: center,
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: true
            };

       var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
       setMarkers(center,  map);
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        var myButton = document.getElementById('myButton');
        var sButton = document.getElementById('sandbox-container');
        var s2Button = document.getElementById('sandbox-container-2');
        var testButton = document.getElementById('myButton_forTest');

        map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(sButton);
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(s2Button);
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(myButton);

        map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(testButton);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        //url: place.icon,
        size: new google.maps.Size(250, 250),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      markers.push(new google.maps.Marker({
        map: map,
        //icon: icon,
        title: place.name,
        position: place.geometry.location
      }));


      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
        
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    // console.log("After fit Bounds:"+map.getZoom());
    map.setZoom(18);
    // console.log("After set Zoom:"+map.getZoom());
  });
}
    

    function setMarkers(center,  map) {
        var bounds = new google.maps.LatLngBounds();
        var json = (function () { 
            var json = null; 
            $.ajax({ 
                'async': false, 
                'global': false, 
                'url': "./javascripts/YouBikeTP.json", 
                'contentType': "application/json; charset=utf-8",
                'dataType': "json", 
                'success': function (data) {
                     json = data 
                 }
            });
            return json;
        })();

       
        /*var circle = new google.maps.Circle({
                strokeColor: '#000000',
                strokeOpacity: 0.25,
                strokeWeight: 1.0,
                fillColor: '#ffffff',
                fillOpacity: 0.1,
                clickable: false,
                map: map,
                center: center,
                radius: radius
            });
        var bounds = circle.getBounds();

        */


        $.each(json.retVal, function(index, value){
            
            latLng = new google.maps.LatLng(this.lat, this.lng); 
           
                // Creating a marker and putting it on the map
                var marker = new MarkerWithLabel({
                    position: latLng,
                    labelContent: this.sbi,
                    labelAnchor: new google.maps.Point(20, 30), //(10, 35),
                    map: map,
                    icon:"./images/pin3.png",
                    labelClass: "labels", // the CSS class for the label
                    labelInForeground: true

                });
                infoBox(map, marker, this);
                bounds.extend(marker.getPosition());
                //circle.bindTo('center', marker, 'position');
            
        });

                map.fitBounds(bounds);

            
       

        
    }
    
    function infoBox(map, marker, data) {
        var infoWindow = new google.maps.InfoWindow();
        var contentString = '<h1 id="firstHeading" class="firstHeading">'+data.sna+'</h1>'+
                            '<div id="bodyContent">'+'<div style="">'+'總車輛:'+data.tot+'</div>'+'<div style="">'+'剩餘車輛:'+data.sbi+'</div>';

        

        google.maps.event.addListener(infoWindow,'closeclick',function(){
            marker.setIcon("./images/pin2.png");
            // then, remove the infowindows name from the array
        });
        // Attaching a click event to the current marker
        google.maps.event.addListener(marker, "click", function(e) {
            marker.setIcon("./images/pin_select.png");
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
            selectlists.push({"name":data.sna, "left_bikes":data.sbi, "day":data.mday, "id":data.sno});
            selectlists_name.push(data.sno);

        });

        // Creating a closure to retain the correct data 
        // Note how I pass the current data in the loop into the closure (marker, data)
        (function(marker, data) {
          // Attaching a click event to the current marker
          google.maps.event.addListener(marker, "click", function(e) {
            marker.setIcon("./images/pin_select.png");
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
            
          });
        })(marker, data);
    }
    
    $(document).ready(function() {
        $("#myButton_forTest").click(function() {
            // console.log("Time is "+ $('#sandbox-container input').val());
            var date = $("#sandbox-container input").data('datepicker').getFormattedDate('yyyymmdd');
            // console.log("date is "+ $("#datetimepicker3").data('DateTimePicker').val);
            var time = $("#datetimepicker3").val();
            // time = time.replace(/:/g, '');
            var res = date.concat(time);
            res = res.split(":")[0];
            console.log(res);
            // console.log("origin"+ selectlists.length);
            // console.log( "stringify" + JSON.stringify(selectlists));
            var jsonData = '{"stations":[],"date":""}';
            var obj = JSON.parse(jsonData);
            obj["date"] = res;
            console.log(obj);
            for(var i=0;i<selectlists.length;i++){
                obj['stations'].push(selectlists[i]);
            }
            

            var jsondatastringify = JSON.stringify(obj);
            // jsonparsedata= JSON.parse(jsondata);
            console.log(jsondatastringify);
            // console.log("object "+ JSON.parse(jsondatastringify));

            // console.log(jsonparsedata["0"].name);
            //console.log("object "+ JSON.parse(jsondata));

            // // var data = {};
            // // data.title = "12132123";
            // // data.message = "message";
            $.ajax({
                type: "POST",
                url: "./users",
                data: jsondatastringify,
                contentType: 'application/json',
                dataType: 'json',
                success:function(data){
                    window.location.href = "/compare-bike";
                    /*
                   setTimeout(function () {
                    // your action here
                    window.location.href = "/compare-bike";
                    }, 500);
                    
                    */
                }
            });
          
            
        });
        $('#sandbox-container input').datepicker({
            autoclose: true,
            todayHighlight: true,
            toggleActive: true,
            format: "yyyy-mm/dd"
        });
        $('#sandbox-container input').datepicker('update',new Date());
        $(function () {
          var dateNow = new Date();
            $('#datetimepicker3').datetimepicker({
                // format: 'LT',
                format: 'HH:mm',
                defaultDate:dateNow
            });
        });
    });
/*
$(document).ready(function() {
    $("#myButton_forTest").click(function() {
        console.log(selectlists_name[0]);
        
        var queryCollection = function(documentId, callback) {
            var querySpec = {
                query: 'SELECT * FROM root r WHERE r.sno=@sno',
                parameters: [{
                    name: '@sno',
                    value: documentId
                }]
            };

            var collectionUri = "dbs/" + config.dbDefinition.id + "/colls/" + config.collDefinition.id;

            client.queryDocuments(collectionUri, querySpec).toArray(function(err, results) {
                if(err) 
                return callback(err);
                callback(null, results);
              });
            };

            queryCollection(selectlists[0], function(err, results) {
                if(err) return console.log(err);
                console.log(results.length);
                console.log(typeof(results));
                // console.log('Query results:\n' + JSON.stringify(results, null, '\t') + '\n');
                console.log('Query results:\n' + results[0].mday +'\n');
            });
          
            
    });
});*/
google.maps.event.addDomListener(window, 'load', initialize);