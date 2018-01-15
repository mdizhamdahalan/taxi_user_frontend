angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, $state, $ionicHistory, PromotionService, $rootScope, $timeout, $ionicLoading, $location, $interval, AccountService) {
    //navIcons = document.getElementsByTagName("button");
    $scope.userData = userData = JSON.parse(window.localStorage.getItem("session_user"));

    $scope.$on('$ionicView.loaded', function () {

        var navIcons = document.getElementsByClassName("ion-navicon");
        for (var i = 0; i < navIcons.length; i++) {
            //navIcons[i].classList.remove("ng-hide");
            navIcons[i].classList.remove("hide");
            //console.log(navIcons[i]);
        }
    
        console.log(userData);
        $scope.theIntervalCheckAccount = null;
        if (!userData) {
            $ionicLoading.hide();
            //$state.go('tab.map');
            $scope.log = 'Đăng nhập';
            $scope.link = "#tab/login";
            $scope.hide = "uuuuu";

            document.getElementById('menu_hist').classList.add('hide');
            document.getElementById('menu_promo').classList.add('hide');
            document.getElementById('menu_logout').classList.add('hide');
            document.getElementById('menu_reg').classList.remove('hide');
            document.getElementById('menu_login').classList.remove('hide');
        
            return false;
        }
        //if (userData && userData != null && userData != undefined) {
        else {
            /*for (i = 0; i < navIcons.length; i++) {
                navIcons[i].classList.remove("ng-hide");
                navIcons[i].classList.remove("hide");
            }*/
            $scope.reload = function() {
                // Your refresh code
                $rootScope.$emit('refreshedPressed');
            }

            document.getElementById('menu_hist').classList.remove('hide');
            document.getElementById('menu_promo').classList.remove('hide');
            document.getElementById('menu_logout').classList.remove('hide');
            document.getElementById('menu_reg').classList.add('hide');
            document.getElementById('menu_login').classList.add('hide');

	        $scope.theIntervalCheckAccount = $interval(function() {
                if (userData) {
                    AccountService.getUserData(userData.id);
                    $scope.log = 'Thoát';
                    $scope.link = "#tab/logout";
                    $scope.hide = "undefined";
                }
            }.bind(this), 1000);

	        PromotionService.getAll(userData.id).then(function(response) {
                $timeout(function() {
                    $scope.promotions_total = response.total;

                    $ionicLoading.hide();
                }, 1000);
            });
        }
    });

})

.controller('TripsCtrl', function($scope, $state, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading, $location, $rootScope) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.userData = userData = JSON.parse(window.localStorage.getItem("session_user"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.check = function () {
        TripsService.countAll(userData.phone).then(function(num) {
            var trips_num = window.localStorage.getItem('trips_num');
            //console.log(num+' ~ '+trips_num);
            if (num != trips_num) $scope.refreshItems();
        })
    }

    $scope.theInterval = null;

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    	if ($location.path() == "/tab/trips") {
            $scope.theInterval = $interval(function(){
                $scope.check();
            }.bind(this), 1000);
            $scope.$on('$destroy', function () {
                $interval.cancel($scope.theInterval)
            });

            $scope.refreshItems();
        }
    });

    $scope.refreshItems = function () {
        if (userData) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            TripsService.getAll(userData.phone).then(function(response) {
                var trips_num = response.total;
                window.localStorage.setItem('trips_num', trips_num);

                $scope.trips = response.data;

                $ionicLoading.hide();
            });
        }
    }

    $scope.view = function(tripID) {
        $state.go('tab.trips.view', {tripID: tripID});
    }
})
.controller('TripsViewCtrl', function($scope, $state, $stateParams, TripsService, $ionicPopup, $interval, $ionicNavBarDelegate, $ionicLoading, $timeout) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.userData = userData = JSON.parse(window.localStorage.getItem("session_user"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.tripID = $stateParams.tripID;
    $scope.trip = {};

    TripsService.getOne($scope.tripID).then(function(response) {
        $timeout(function() {
            //console.log(response);
            //console.log('~~~');
            $scope.trip = response;

            if (response.is_round == 0) {
                document.getElementsByTagName("notround")[0].classList.remove("ng-hide");
                document.getElementsByTagName("round")[0].classList.add("ng-hide");
            } else {
                document.getElementsByTagName("round")[0].classList.remove("ng-hide");
                document.getElementsByTagName("notround")[0].classList.add("ng-hide");
            }
            $scope.trip = response; //Assign data received to $scope.data

            $ionicLoading.hide();
        }, 100);
    });
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $timeout, $interval, RequestService, $ionicPopup, ionicTimePicker, ionicDatePicker, $ionicLoading, $ionicNavBarDelegate) {
    //$ionicNavBarDelegate.showBackButton(false);
    /*navIcons = document.getElementsByClassName("ion-navicon");
    for (i = 0; i < navIcons.length; i++) {
        navIcons[i].classList.remove("ng-hide");
        navIcons[i].classList.remove("hide");
    }*/
    
    var options = {timeout: 10000, enableHighAccuracy: true};
    markerArray = [];

/*    $scope.disableTap = function() {*
        var container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        var backdrop = document.getElementsByClassName('backdrop');
        angular.element(backdrop).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
        document.getElementById('pac-input').blur();
        });
    }; */
    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        for (i = 0; i < container.length; i++) {
            container[i].setAttribute('data-tap-disabled', 'true');
        }
        //console.log('disableTap');
    }

    var timePickerObj = {
        callback: function (val) {      //Mandatory
            if (typeof (val) === 'undefined') {
                //console.log('Time not selected');
            } else {
                var selectedTime = new Date(val * 1000);
                var min = selectedTime.getUTCMinutes();
                if (min < 10) min = '0'+min;
                document.getElementById('time_time').value = selectedTime.getUTCHours()+':'+min;
            }
        },
        inputTime: 50400,   //Optional
        format: 12,         //Optional
        step: 5,           //Optional
        closeLabel: 'Đóng',
        setLabel: 'Đặt'    //Optional
    };
    $scope.openTimePicker = function () {
        ionicTimePicker.openTimePicker(timePickerObj);
    }
    var datePickerObj = {
        callback: function (val) {  //Mandatory
            var date = new Date(val);
            var month = date.getMonth()+1;
            var day = date.getDate();
            if (month < 10) month = '0'+month;
            if (day < 10) day = '0'+day;
            document.getElementById('time_date').value = date.getFullYear()+'-'+month+'-'+day;
        },
        from: new Date(), //Optional
        to: new Date(2018, 12, 31), //Optional
        inputDate: new Date(),      //Optional
        dateFormat: 'yyyy-mm-dd',
        closeLabel: 'Đóng',
        setLabel: 'Đặt',    //Optional
        templateType: 'popup'       //Optional
    };
    $scope.openDatePicker = function(){
        ionicDatePicker.openDatePicker(datePickerObj);
    };

    $scope.select_seat = function (seat) {
        var sones = document.getElementsByClassName('sone');
        document.getElementById('seat').value = seat;
        for (i = 0; i < sones.length; i++) {
            sones[i].classList.remove('active');
            if (sones[i].id == 'seat'+seat) {
                sones[i].classList.add('active');
            }
        }
    }

    $scope.request_first = function () {
        from = document.getElementById('start').value;
        to = document.getElementById('end').value;
        seat = document.getElementById('seat').value;
        distance = document.getElementById('box-search-one-distance').innerHTML;
        if (from && to && seat) {
            var frAr = from.split(',');
            var toAr = to.split(',');
            var fromDistrict = frAr[frAr.length-3].trim(); // quận đi
            var toDistrict = toAr[toAr.length-3].trim(); // quận đến

            distance = document.getElementById('box-search-one-distance').innerHTML;
            var mult = 10;
            if (seat == 7) mult =12;

            var priceThisTrip = parseFloat(distance)*mult;
	    if (seat==16) priceThisTrip=1;            
	    if ((fromDistrict == 'Cầu Giấy' || fromDistrict == 'Đống Đa' || fromDistrict == 'Ba Đình' || fromDistrict == 'Hai Bà Trưng' || fromDistrict == 'Nam Từ Liêm' || fromDistrict == 'Bắc Từ Liêm' ) && toDistrict == 'Sóc Sơn')
	    {
		if(seat == 4 || seat == 5)
		{priceThisTrip = 190;}
		else if(seat == 7)
		{priceThisTrip = 300;}
	    }

	    if ((toDistrict == 'Cầu Giấy' || toDistrict == 'Đống Đa' || toDistrict == 'Ba Đình' || toDistrict == 'Hai Bà Trưng' || toDistrict == 'Nam Từ Liêm' || toDistrict == 'Bắc Từ Liêm' ) && fromDistrict == 'Sóc Sơn')
	    {	
		if(seat == 4 || seat == 5)
		{priceThisTrip = 250;}
		else if(seat ==7)
		{priceThisTrip = 350;}
	    }

	    if (fromDistrict == 'Gia Lâm' && toDistrict == 'Sóc Sơn')
	    {
		if(seat == 4 || seat == 5)
		priceThisTrip = 250;
		else if(seat==7)
		priceThisTrip = 350;
	    }

	    if (toDistrict == 'Gia Lâm' && fromDistrict == 'Sóc Sơn')
	    {
		if(seat == 4 || seat == 5)
		priceThisTrip = 300;
		else
		priceThisTrip = 370;
	    }

	    if (fromDistrict == 'Thanh Xuân' && toDistrict == 'Sóc Sơn')
	    {
        	if(seat == 4 || seat == 5)
		priceThisTrip = 230;
		else if(seat==7)
		priceThisTrip = 320;
	    }

	    if (toDistrict == 'Thanh Xuân' && fromDistrict == 'Sóc Sơn')
	    {
  		if(seat == 4 || seat == 5)
		priceThisTrip = 250;
		else if(seat==7)
		priceThisTrip = 330;
	    }

if (fromDistrict == 'Long Biên' && toDistrict == 'Sóc Sơn')
{
	if(seat == 4 || seat == 5)
	priceThisTrip = 230;
	else if(seat==7)
	priceThisTrip = 320;
}

if (toDistrict == 'Long Biên' && fromDistrict == 'Sóc Sơn')
{
	if(seat == 4 || seat == 5)
	priceThisTrip = 260;
	else if(seat==7)
	priceThisTrip = 350;
}

if (fromDistrict == 'Hà Đông' && toDistrict == 'Sóc Sơn')
{
	if(seat == 4 || seat == 5)
	priceThisTrip = 250;
	else if(seat==7)
	priceThisTrip = 350;
}

if (toDistrict == 'Hà Đông' && fromDistrict == 'Sóc Sơn')
{
	if(seat == 4 || seat == 5)
	priceThisTrip = 270;
	else if(seat==7)
	priceThisTrip = 370;
}

if (fromDistrict == 'Thanh Trì' && toDistrict == 'Sóc Sơn')
{
	if(seat == 4 || seat == 5)
	priceThisTrip = 250;
	else if(seat==7)
	priceThisTrip = 350;
}

if (toDistrict == 'Thanh Trì' && fromDistrict == 'Sóc Sơn')
{
	if(seat == 4 || seat == 5)
	priceThisTrip = 300;
	else if(seat==7)
	priceThisTrip = 370;
}

if (fromDistrict == 'Hoàng Mai' && toDistrict == 'Sóc Sơn')
{
	if(seat == 4 || seat == 5)
	priceThisTrip = 250;
	else if(seat==7)
	priceThisTrip = 350;
}

if (toDistrict == 'Hoàng Mai' && fromDistrict == 'Sóc Sơn')
{
	if(seat == 4 || seat == 5)
	priceThisTrip = 280;
	else if(seat==7)
	priceThisTrip = 370;
}
	    document.getElementById('price').value = priceThisTrip;

            var tripInfo = 'Đi từ: <b>' +frAr+ '</b>.<br/>Đến: <b>' +toAr+ '</b>.<br/>Loại xe: <b>'+seat+' chỗ</b>.<br/>Quãng đường: <b>' +distance+ '</b>.<br/>Giá tiền (tham khảo): <b>' +priceThisTrip+ 'k</b>';

            var alertPopup = $ionicPopup.alert({
                title: 'Thông tin giá tiền',
                template: tripInfo,
                scope: $scope,
                buttons: [
                    {
                        text: 'Quay lại',
                        type: 'button-stable'
                    },
                    {
                        text: '<b>Đặt xe</b>',
                        type: 'button-assertive',
                        onTap: function(e) {
                            return 1;
                        }
                    }
                ]
            });
            alertPopup.then(function(res) {
                //console.log('Tapped!', res);
                if (res == 1) {
                    detailsForm = document.getElementById('trip-user-details');
                    detailsForm.classList.add('active');
                    document.getElementById('tripInfo').innerHTML = tripInfo;
                }
            });
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Lỗi',
                template: 'Bạn phải điền đầy đủ thông tin: <br/>Điểm đi, <br/>Điểm đến, <br/>Xe số chỗ.',
                scope: $scope,
                buttons: [{
                    text: '<b>Đóng</b>',
                    type: 'button-assertive'
                }]
            });
        }
    }

    $scope.request = function () {
        from = document.getElementById('start').value;
        to = document.getElementById('end').value;
        name = document.getElementById('name').value;
        phone = document.getElementById('phone').value;
        seat = document.getElementById('seat').value;
        guess_num = document.getElementById('guess_num').value;
        time_date = document.getElementById('time_date').value;
        time_time = document.getElementById('time_time').value;
        time = time_date+' '+time_time+':00';
        is_round = document.getElementById('is_round').value;
        details = document.getElementById('details').value;
        PNR = document.getElementById('PNR').value;
        var priceThisTrip = document.getElementById('price').value;
//        console.log(priceThisTrip+' ~ ');
	var userData = JSON.parse(window.localStorage.getItem("session_user"));
	if (userData){
		userid = userData.id;
	}
//	console.log(userData);
        //console.log(name+' '+phone+' '+from+' '+to+' '+seat+' '+guess_num+' '+PNR);
        if (name && phone && from && to && seat > 0 && guess_num > 0 && time && priceThisTrip) {
        if (userData){
		formData = {
                'name': name,
                'phone': phone,
                'from': from,
                'to': to,
                'seat': seat,
                'guess_num': guess_num,
                'PNR': PNR,
                'time': time,
                'price': priceThisTrip,
                'is_round': is_round,
                'details': details,
		'userid': userid
            	};
	    }
	else{
	    	formData = {
                'name': name,
                'phone': phone,
                'from': from,
                'to': to,
                'seat': seat,
                'guess_num': guess_num,
                'PNR': PNR,
                'time': time,
                'price': priceThisTrip,
                'is_round': is_round,
                'details': details
            	};
	    }
//            console.log(formData);
            RequestService.request(formData).then(function(data) {
//                console.log(data);
                if (data == 1) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Thành công!',
                        template: 'Quý khách đã đặt xe thành công. Nhân viên công ty sẽ liên hệ để xác nhận với quý khách ngay bây giờ. Cảm ơn quý khác đã tin tưởng và sử dụng dịch vụ của công ty Đông Dương D.C. Trân trọng.',
                        scope: $scope,
                        buttons: [{
                              text: 'Đóng',
                              type: 'button-assertive',
                              onTap: function(e) {
                                  return 1;
                              }
                        }]
                    });
                    alertPopup.then(function(res) {
//                        console.log('Success!', res);
                        if (res == 1) {
                            /*detailsForm = document.getElementById('trip-user-details');
                            detailsForm.classList.remove('active');
                            document.getElementById('tripInfo').innerHTML = '';
                            $state.go($state.current, {}, {reload: true});*/
                            location.reload();
                        }
                    });
                }
            })
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Lỗi!',
                template: 'Bạn phải nhập đầy đủ thông tin để đặt xe!',
                scope: $scope,
                buttons: [{
                      text: 'Đóng',
                      type: 'button-assertive'
                }]
            });
        }
    }

    $scope.showSteps = function (directionResult, markerArray, stepDisplay, map) {
    	// For each step, place a marker, and add the text to the marker's infowindow.
    	// Also attach the marker to an array so we can keep track of it and remove it
    	// when calculating new routes.
    	var myRoute = directionResult.routes[0].legs[0];
    	for (var i = 0; i < myRoute.steps.length; i++) {
    		var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
    		marker.setMap(map);
    		marker.setPosition(myRoute.steps[i].start_location);
    		$scope.attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
    	}
    }

    $scope.attachInstructionText = function (stepDisplay, marker, text, map) {
    	google.maps.event.addListener(marker, 'click', function() {
    		// Open an info window when the marker is clicked on, containing the text
    		// of the step.
    		stepDisplay.setContent(text);
    		stepDisplay.open(map, marker);
    	});
    }

    $scope.calculateAndDisplayRoute = function (directionsDisplay, directionsService, stepDisplay, map) {
        //console.log(document.getElementById('start').value);
        //console.log(document.getElementById('end').value);

        // First, remove any existing markers from the map.
    	for (var i = 0; i < markerArray.length; i++) {
    		markerArray[i].setMap(null);
    	}
        markerArray = [];

    	// Retrieve the start and end locations and create a DirectionsRequest using
    	// {travelMode} directions.
    	directionsService.route({
    		origin: document.getElementById('start').value,
    		destination: document.getElementById('end').value,
    		travelMode: document.getElementById('travelMode').value // DRIVING | BICYCLING | TRANSIT | WALKING
    	}, function(response, status) {
    		// Route the directions and pass the response to a function to create
    		// markers for each step.
    		if (status === 'OK') {
    			document.getElementById('warnings-panel').innerHTML = '<b>' + response.routes[0].warnings + '</b>';
    			directionsDisplay.setDirections(response);

            	$scope.showSteps(response, stepDisplay, map);

    			var distance = response.routes[0].legs[0].distance.text;
    			var time = response.routes[0].legs[0].duration.text;
    			document.getElementById('box-search-one-distance').innerHTML = distance;
    			document.getElementById('box-search-one-time').innerHTML = time;
    			document.getElementById('box-search-one-route').visibility = true;
    		} else {
    			//console.log('Directions request failed due to ' + status);
    		}
    	});
    }

    $scope.getDirection = function (map, pos) {
    	map.setZoom(13);

    	// Instantiate a directions service.
    	var directionsService = new google.maps.DirectionsService;
    	var geocoder = new google.maps.Geocoder();

		map.setCenter(pos);

		geocoder.geocode({
			'location': pos
		}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
				//	document.getElementById('start').value = results[0].formatted_address;

        			// Create a renderer for directions and bind it to the map.
        			var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
        			// Instantiate an info window to hold step text.
        			var stepDisplay = new google.maps.InfoWindow;

					$scope.calculateAndDisplayRoute(directionsDisplay, directionsService, stepDisplay, map);
				} else {
					console.log('No results found');
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}
		});

    }

    $scope.map_select = function(map, autocomplete, infowindow, type) {
        for (var i = 0; i < markerArray.length; i++) {
    		markerArray[i].setMap(null);
    	}
        markerArray = [];

        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        var infowindowContent = document.getElementById('infowindow-content-'+type);
		infowindow.setContent(infowindowContent);

        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(10);
        }
        //console.log(place);
        if (type == 0) document.getElementById('start').value = place.formatted_address;
        else if (type == 1) document.getElementById('end').value = place.formatted_address;

        index = type;
        var marker_now = new google.maps.Marker({
            label: labels[index++ % labels.length],
            map: map
        });
        marker_now.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
        });

        marker_now.setVisible(true);
        google.maps.event.addListener(marker_now, 'click', function() {
            infowindow.setContent('<div><strong>'+place.name+'</strong><br/>' + place.formatted_address + '<br>' +
            place.place_id + '</div>');
            infowindow.open(map, this);
        });

        if (document.getElementById('start').value != null && document.getElementById('end').value != null)
            $scope.getDirection(map, place.geometry.location);
    }

    $scope.searchBar = function (map) {
        var sidebar = document.getElementById('pac-sidebar');
        var from = document.getElementById('pac-from');
        var to = document.getElementById('pac-to');

        var options = {componentRestrictions: {country: 'vn'}};
//        $scope.map.controls[google.maps.ControlPosition.LEFT].push(sidebar);

var autocomplete_from = new google.maps.places.Autocomplete(from, options);
var autocomplete_to = new google.maps.places.Autocomplete(to, options);

/*autocomplete_from.bindTo('bounds', $scope.map);
autocomplete_to.bindTo('bounds', $scope.map);
*/
google.maps.event.addDomListener(from, 'keydown', function(e) {
    //console.log('keydown!')
    if (e.keyCode == 13 && $('.pac-container:visible').length) {
        e.preventDefault();
    }
});
        google.maps.event.trigger(to, 'keydown', function(e) {
            //console.log(e.keyCode);
            if(e.keyCode===13 && !e.triggered){
                google.maps.event.trigger(this,'keydown',{keyCode:40})
                google.maps.event.trigger(this,'keydown',{keyCode:13,triggered:true})
            }
        });

        var infowindow = new google.maps.InfoWindow();

//        autocomplete_to.addListener('place_changed', function() {
        google.maps.event.addListener(autocomplete_to, 'place_changed', function () {
            $scope.map_select(map, autocomplete_to, infowindow, 1);
        });
        google.maps.event.addListener(autocomplete_from, 'place_changed', function () {
            $scope.map_select(map, autocomplete_from, infowindow, 0);
        });
    }


    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var latLng = new google.maps.LatLng(21.033, 105.85);
    var mapOptions = {
      zoom: 11,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
        var marker = markerArray[0] = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            animation: google.maps.Animation.DROP
        });

        /*var infoWindow = new google.maps.InfoWindow({
            content: "Here I am!"
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });*/

        $scope.searchBar($scope.map);

        $scope.theInterval = null;

        $scope.theInterval = $interval(function() {
            var pacContainers = document.getElementsByClassName('pac-container');
            if (pacContainers.length >= 2) {
                $interval.cancel($scope.theInterval);
                $scope.disableTap();
                $ionicLoading.hide();
            }
        }.bind(this), 1000);
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.theInterval)
        });

    });

})

.controller('LogoutCtrl', function($scope, $ionicPopup, $state, $ionicNavBarDelegate) {
    $ionicNavBarDelegate.showBackButton(false);
    window.localStorage.removeItem("session_user");
    $scope.userData = userData = null;
    /*navIcons = document.getElementsByClassName("ion-navicon");
    for (i = 0; i < navIcons.length; i++) {
        navIcons[i].classList.remove("ng-hide");
        navIcons[i].classList.remove("hide");
        console.log(navIcons[i]);
    }*/
    $scope.log = 'Đăng nhập';
    $scope.link = "#tab/login";
    $scope.hide = "uuuuu";

    document.getElementById('menu_hist').classList.add('hide');
    document.getElementById('menu_promo').classList.add('hide');
    document.getElementById('menu_logout').classList.add('hide');
    document.getElementById('menu_reg').classList.remove('hide');
    document.getElementById('menu_login').classList.remove('hide');

    $state.go('tab.map');
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $ionicSideMenuDelegate, $ionicNavBarDelegate, $ionicHistory, $rootScope, $interval, PromotionService, AccountService, $timeout, $ionicLoading) {
    //$ionicSideMenuDelegate.canDragContent(false);
    $ionicNavBarDelegate.showBackButton(false);
    $scope.data = {};
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).then(function(data) {
//            console.log(data);
            if (data == -1) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi!',
                    template: 'Tên đăng nhập hoặc mật khẩu không đúng!',
                    scope: $scope,
                    buttons: [{
                          text: 'Đóng',
                          type: 'button-assertive'
                    }]
                });
            } else if (data == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi!',
                    template: 'Tên đăng nhập hoặc mật khẩu không đúng!',
                    scope: $scope,
                    buttons: [{
                          text: 'Đóng',
                          type: 'button-assertive'
                    }]
                });
            } else {
                userData = data;
                //document.getElementsByTagName("info")[0].innerHTML = userData.name;
                //document.getElementsByTagName("coin")[0].innerHTML = userData.coin+"k";

                //$ionicSideMenuDelegate.canDragContent(true);
                //$ionicNavBarDelegate.showBackButton(true);
                var navIcons = document.getElementsByClassName("ion-navicon");
                for (var i = 0; i < navIcons.length; i++) {
                    navIcons[i].classList.remove("hide");
                }

                $scope.theIntervalCheckAccount = null;
                $scope.theIntervalCheckAccount = $interval(function(){
                    AccountService.getUserData(userData.id);
                    $scope.log = 'Thoát';
                    $scope.link = "#tab/logout";
                    $scope.hide = "undefined";
                }.bind(this), 1000);
    
                PromotionService.getAll(userData.id).then(function(response) {
                    $timeout(function() {
                        $scope.promotions_total = response.total;
    
                        $ionicLoading.hide();
                    }, 1000);
                });

                document.getElementById('menu_hist').classList.remove('hide');
                document.getElementById('menu_promo').classList.remove('hide');
                document.getElementById('menu_logout').classList.remove('hide');
                document.getElementById('menu_reg').classList.add('hide');
                document.getElementById('menu_login').classList.add('hide');

                $state.go('tab.map');
            }
        })
    }
})

.controller('RegisterCtrl', function($scope, RegisterService, $ionicPopup, $state, $ionicSideMenuDelegate, $ionicNavBarDelegate, $ionicHistory, $rootScope, $interval) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.data = {};
    $scope.register = function() {
        RegisterService.registerUser($scope.data.username, $scope.data.password, $scope.data.phone, $scope.data.address).then(function(data) {
//            console.log(data);
            if (data == -1) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi!',
                    template: 'Thiếu thông tin!',
                    scope: $scope,
                    buttons: [{
                          text: 'Đóng',
                          type: 'button-assertive'
                    }]
                });
            } else if (data == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi!',
                    template: 'Tên đăng nhập hoặc mật khẩu không đúng!',
                    scope: $scope,
                    buttons: [{
                          text: 'Đóng',
                          type: 'button-assertive'
                    }]
                });
            } else {
               registerData = data;
                //document.getElementsByTagName("info")[0].innerHTML = userData.name;
                //document.getElementsByTagName("coin")[0].innerHTML = userData.coin+"k";

                /*navIcons = document.getElementsByClassName("ion-navicon");
                for (i = 0; i < navIcons.length; i++) {
                    navIcons[i].classList.remove("ng-hide");
                    navIcons[i].classList.remove("hide");
                }*/

                $state.go('tab.login');
            }
        })
    }
})


.controller('AccountCtrl', function($scope, $state, $stateParams, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.userData = userData = JSON.parse(window.localStorage.getItem("session_user"));

    if (userData) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $timeout(function() {
            console.log(userData);
            $scope.account = userData;
            $ionicLoading.hide();
        }, 1000);
    }
})

.controller('BookHistoryCtrl', function($scope, $state, BookHistoryService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.userData = userData = JSON.parse(window.localStorage.getItem("session_user"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    BookHistoryService.getAll(userData.id).then(function(response) {
        $timeout(function() {
            $scope.trips = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });
})

.controller('PromotionCtrl', function($scope, $state, PromotionService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading){
    $ionicNavBarDelegate.showBackButton(false);
    $scope.userData = userData = JSON.parse(window.localStorage.getItem("session_user"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    if (!$scope.userData){}
    PromotionService.getAll(userData.id).then(function(response) {
        $timeout(function() {
            $scope.promotions_others = response.others; //Assign data received to $scope.data
	    $scope.promotions_notSeen = response.notSeen;
//	    $scope.promotions_total = response.total;
//	    console.log($scope.promotions_total);
            $ionicLoading.hide();
        }, 1000);
    });

    $scope.view = function(pID) {
        $state.go('tab.noti.view', {pID: pID});
    }

})

.controller('PromotionViewCtrl', function($scope, $state, $stateParams, PromotionService, $ionicPopup, $interval, $ionicNavBarDelegate, $ionicLoading, $timeout) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.userData = userData = JSON.parse(window.localStorage.getItem("session_user"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    $scope.promotion  = {};
    $scope.pID = $stateParams.pID;

    // Get One
    PromotionService.getOne($scope.pID).then(function(response) {
        $timeout(function() {
            $scope.promotion = response; //Assign data received to $scope.data
	    console.log(response);
            $ionicLoading.hide();
        }, 1000);
    });

})


