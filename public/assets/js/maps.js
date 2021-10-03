let map;
let marker;

initMap();

function initMap() {
  const mylatlong = { lat: -2.8064207, lng: -79.3212202 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: mylatlong,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });
  marker = new google.maps.Marker({
    position: mylatlong,
    map,
    title: "Select coordinates",
    draggable: true
  });
  //marker.setPosition(mylatlong);

  /*google.maps.event.addListener(marker, 'dragend', function (evt) {
      let msj = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(4) + ' Current Lng: ' + evt.latLng.lng().toFixed(4) + '</p>';
      alert(msj);
  });*/

  google.maps.event.addListener(map, 'click', function(evt) {
     //placeMarker(event.latLng);
     let lat_up    = parseFloat(evt.latLng.lat().toFixed(6)) + 0.005;
     let lat_down  = parseFloat(evt.latLng.lat().toFixed(6)) - 0.005;
     let lng_left  = parseFloat(evt.latLng.lng().toFixed(6)) - 0.005;
     let lng_right = parseFloat(evt.latLng.lng().toFixed(6)) + 0.005;

     let msj = `[${lng_left}, ${lat_down}, ${lng_right}, ${lat_up}]` ;
     alert(msj);

     marker.setPosition(evt.latLng);
  });

  /*google.maps.event.addListener(marker, 'dragstart', function (evt) {
  });*/

  //map.setCenter(marker.position);
  //marker.setMap(map);

}

function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

$(function () {
  $('#datetimepicker1').datetimepicker();
});
