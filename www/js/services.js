angular.module('starter.services', [])

.factory('PasswordService', function($q, $http) {
    return {
        change: function (pw, taxiid) {
            return $http.post(MAIN_URL+"/changePassword.php", {
                    taxiid: taxiid,
                    password: pw
                }).then(function(response) {
                    return response.data;
                });
        }
    }
})

.factory('RequestService', function($q, $http) {
    return {
        request: function(formData) {
            return $http.post(MAIN_URL+"/trip_add.php", formData).then(function(response) {
                console.log(response);
                return response.data;
            });
        }
    }
})

.factory('LoginService', function($q, $http) {
    return {
/*        checkLogin: function() {
            return $http.get(MAIN_URL+"/login_check.php").then(function(response) {
                //    console.log(response);
                    return response.data;
                });
        }
*/
        loginUser: function(name, pw) {
            return $http.post(MAIN_URL+"/login.php", {
                    username: name,
                    password: pw
                }).then(function(response) {
                    //console.log(response);
                    window.localStorage.setItem('session', JSON.stringify(response.data));
                    return response.data;
                });
/*            var deferred = $q.defer();
            var promise = deferred.promise;
            if (name == 'user' && pw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;*/
        }
    }
})

.factory('TripsService', function($http) {
  // Might use a resource here that returns a JSON array
  var trips = [];

  return {
    remove: function(trip) {
      trips.splice(trips.indexOf(trip), 1);
    },
    getAll: function(taxiid) {
      return $http.post(MAIN_URL+"/trip_all.php", {taxiid: taxiid})
                .then(function(response) {
        			trips = response.data;
        			return trips;
        		});
    },
    getOne: function(tripID) {
        return $http.post(MAIN_URL+"/trip_one.php", {id: tripID})
                  .then(function(response) {
          			trip = response.data;
          			return trip;
          		});
    },
    buy: function(tripID, taxiid) {
        return $http.post(MAIN_URL+"/trip_buy.php", {id: tripID, taxiid: taxiid})
                  .then(function(response) {
          			return response.data;
          		});
    },
    getAllBuy: function (taxiid) {
        return $http.post(MAIN_URL+"/trip_all_buy.php", {taxiid: taxiid})
                  .then(function(response) {
          			trips = response.data;
          			return trips;
          		});
    }
  };
})


.factory('HistoryService', function($http) {
  var histories = [];

  return {
    getAll: function(taxiID) {
      return $http.post(MAIN_URL+"/paycoin_all.php", {taxiid: taxiID})
                .then(function(response) {
        			histories = response.data;
                    console.log(histories);
        			return histories;
        		});
    },
    getOne: function(hID) {
        return $http.post(MAIN_URL+"/paycoin_one.php", {id: hID})
                  .then(function(response) {
          			history = response.data;
          			return history;
          		});
    }
  };
})


.factory('InfriengeService', function($http) {
  var infrienges = [];

  return {
    getAll: function(taxiID) {
      return $http.post(MAIN_URL+"/infrienge_all.php", {taxiid: taxiID})
                .then(function(response) {
        			infrienges = response.data;
                    console.log(infrienges);
        			return infrienges;
        		});
    },
    getOne: function(iID) {
        return $http.post(MAIN_URL+"/infrienge_one.php", {id: iID})
                .then(function(response) {
          			infrienge = response.data;
          			return infrienge;
                });
    }
  };
})
