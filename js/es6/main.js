(function() {
  'use strict';
  $(document).ready(initialize);
  function initialize() {
    initMap(40, -95, 4);
    $('#add').click(show);
  }
  var charts = {};
  var map;
  function initMap(lat, lng, zoom) {
    var styles = [{'stylers': [{'hue': '#ff1a00'}, {'invert_lightness': true}, {'saturation': -100}, {'lightness': 33}, {'gamma': 0.5}]}, {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [{'color': '#2D333C'}]
    }];
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
  function addMarker(lat, lng, name, icon) {
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      map: map,
      position: latLng,
      title: name,
      icon: icon
    });
  }
  function show() {
    var city = $('#place').val();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: city}, (function(results, status) {
      var name = results[0].formatted_address;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name, './media/flag.png');
      var latLng = new google.maps.LatLng(lat, lng);
      map.setCenter(latLng);
      map.setZoom(10);
    }));
    getWeather();
    $('#place').val('').focus();
  }
  function getWeather() {
    var zipcode = $('#place').val().trim();
    var url = 'http://api.wunderground.com/api/357ca8eec3b7e3da/forecast10day/q/' + zipcode + '.json?callback=?';
    $.getJSON(url, function(data) {
      $('#charts').append(("<div class=chart data-zip=" + zipcode + "></div>"));
      makeGraph(zipcode);
      getForecast(zipcode, data);
    });
  }
  function getForecast(zipcode, data) {
    makeGraph(zipcode);
    var days = data.forecast.simpleforecast.forecastday;
    var chart = charts[$traceurRuntime.toProperty(zipcode)];
    for (var i = 0; i < days.length; i++) {
      var high = days[$traceurRuntime.toProperty(i)].high.fahrenheit;
      var low = days[$traceurRuntime.toProperty(i)].low.fahrenheit;
      var month = days[$traceurRuntime.toProperty(i)].date.month;
      var day = days[$traceurRuntime.toProperty(i)].date.day;
      charts[$traceurRuntime.toProperty(zipcode)].dataProvider.push({
        date: (month + "/" + day),
        low: parseInt(low),
        high: parseInt(high)
      });
    }
    chart.validateData();
  }
  function makeGraph(zip) {
    var chart = $((".chart[data-zip=" + zip + "]"))[0];
    $traceurRuntime.setProperty(charts, zip, AmCharts.makeChart(chart, {
      'type': 'serial',
      'theme': 'chalk',
      'pathToImages': 'http://www.amcharts.com/lib/3/images/',
      'titles': [{
        'text': zip,
        'size': 15
      }],
      'legend': {'useGraphSettings': true},
      'dataProvider': [],
      'valueAxes': [{
        'id': 'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#FF6600',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left'
      }],
      'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#FF6600',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'low-temp',
        'valueField': 'low',
        'fillAlphas': 0
      }, {
        'valueAxis': 'v1',
        'lineColor': '#B0DE09',
        'bullet': 'triangleUp',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'high-temp',
        'valueField': 'high',
        'fillAlphas': 0
      }],
      'chartCursor': {'cursorPosition': 'mouse'},
      'categoryField': 'date',
      'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true
      }
    }));
  }
})();

//# sourceMappingURL=main.map
