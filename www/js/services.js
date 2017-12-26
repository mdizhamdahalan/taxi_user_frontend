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

.factory('RegisterService', function($q, $http) {
    return {
        registerUser: function(username, password, name, phone, address) {
            return $http.post(MAIN_URL+"/register.php", {
                    username: username,
                    password: password,
		    name: name,
		    phone: phone,
		    address: address
                }).then(function(response) {
                    console.log(response.data);
                    window.localStorage.setItem("session_user", JSON.stringify(response.data));
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
                    console.log(response);
                    window.localStorage.setItem("session_user", JSON.stringify(response.data));
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

.factory('AccountService', function($http) {
    return {
        getUserData: function(userid) {
            return $http.post(MAIN_URL+"/getUserData.php", {id: userid}).then(function(response) {
                //console.log(response);
                if (response.data != -1) {
                    window.localStorage.setItem("session_user", JSON.stringify(response.data));
                }
                return response.data;
            });
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
    getAll: function(user_phone) {
      return $http.post(MAIN_URL+"/trip_all.php", {user_phone: user_phone})
                .then(function(response) {
        			trips = response.data;
        			return trips;
        		});
    },
    countAll: function (user_phone) {
      return $http.post(MAIN_URL+"/trip_count_all.php", {user_phone: user_phone})
                .then(function(response) {
        			trips_num = response.data;
        			return trips_num;
        		});
    },
    getOne: function(tripID) {
        return $http.post(MAIN_URL+"/trip_one.php", {id: tripID})
                  .then(function(response) {
          			trip = response.data;
          			return trip;
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

/*
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
*/
.factory('PromotionService', function($http) {
  var promotions = [];
  return {
    getAll: function(userID) {
      return $http.post(MAIN_URL+"/promotion_all.php", {userID: userID})
                .then(function(response) {
                                promotions = response.data;
                    console.log(promotions);
                                return promotions;
                        });
    },

    getOne: function(pID) {
        return $http.post(MAIN_URL+"/promotion_one.php", {id: pID})
                .then(function(response) {
                                console.log(response);
                                promotion = response.data;
                                return promotion;
                });
    }
  };
})

