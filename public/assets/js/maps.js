let map;
let marker;
let msj;

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
     cargar_mapa(msj);

     marker.setPosition(evt.latLng);
  });

}

function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function cargar_mapa(msj){

  request = $.ajax({
        url: "http://localhost:3000/sentinel/auth_token",
        type: "post",
  });

  request.done(function (response, textStatus, jqXHR){

       let fecha1 = document.getElementById("fecha1").value + "T00:00:00Z";
       var d = new Date(fecha1);
       let dia = d.getDate() + 2;
       let mes = d.getMonth() + 1;
       let fecha2 = d.getFullYear() + "-" + mes.toString().padStart(2,0) + "-" + dia.toString().padStart(2,0) + "T00:00:00Z";
       document.getElementById("iframe").src = "http://cobrosjeff.000webhostapp.com/curl.php?token="+response+"&bbox="+msj+"&from="+fecha1+"&to="+fecha2;
      // alert("http://cobrosjeff.000webhostapp.com/curl.php?token="+response+"&bbox="+msj+"&from="+fecha1+"&to="+fecha2);
   });

}
