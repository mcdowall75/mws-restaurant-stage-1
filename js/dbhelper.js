"use strict";var _createClass=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function openDatabase(){return navigator.serviceWorker?idb.open("wittr",1,function(e){e.createObjectStore("wittrs",{keyPath:"id"}).createIndex("by-date","time")}):Promise.resolve()}function openDatabase(){idb.open("restaurants-db",2,function(e){e.objectStoreNames.contains("restaurants")||e.createObjectStore("restaurants")})}var idbrestaurantval={get:function(t){return dbPromise.then(function(e){return e.transaction("restaurants").objectStore("restaurants").get(t)})},set:function(n,r){return dbPromise.then(function(e){var t=e.transaction("restaurants","readwrite");return t.objectStore("restaurants").put(r,n),t.complete})},delete:function(n){return dbPromise.then(function(e){var t=e.transaction("restaurants","readwrite");return t.objectStore("restaurants").delete(n),t.complete})},clear:function(){return dbPromise.then(function(e){var t=e.transaction("restaurants","readwrite");return t.objectStore("restaurants").clear(),t.complete})},keys:function(){return dbPromise.then(function(e){var t=e.transaction("restaurants"),n=[],r=t.objectStore("restaurants");return(r.iterateKeyCursor||r.iterateCursor).call(r,function(e){e&&(n.push(e.restaurant),e.continue())}),t.complete.then(function(){return n})})}},DBHelper=function(){function o(){_classCallCheck(this,o)}return _createClass(o,null,[{key:"fetchRestaurants",value:function(n){var r=new XMLHttpRequest;r.open("GET",o.DATABASE_URL),r.onload=function(){if(200===r.status){var e=JSON.parse(r.responseText);n(null,e)}else{var t="Request failed. Returned status of "+r.status;n(t,null)}},r.send()}},{key:"fetchRestaurantById",value:function(r,a){o.fetchRestaurants(function(e,t){if(e)a(e,null);else{var n=t.find(function(e){return e.id==r});n?a(null,n):a("Restaurant does not exist",null)}})}},{key:"fetchRestaurantByCuisine",value:function(r,a){o.fetchRestaurants(function(e,t){if(e)a(e,null);else{var n=t.filter(function(e){return e.cuisine_type==r});a(null,n)}})}},{key:"fetchRestaurantByNeighborhood",value:function(r,a){o.fetchRestaurants(function(e,t){if(e)a(e,null);else{var n=t.filter(function(e){return e.neighborhood==r});a(null,n)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(r,a,u){o.fetchRestaurants(function(e,t){if(e)u(e,null);else{var n=t;"all"!=r&&(n=n.filter(function(e){return e.cuisine_type==r})),"all"!=a&&(n=n.filter(function(e){return e.neighborhood==a})),u(null,n)}})}},{key:"fetchNeighborhoods",value:function(a){o.fetchRestaurants(function(e,n){if(e)a(e,null);else{var r=n.map(function(e,t){return n[t].neighborhood}),t=r.filter(function(e,t){return r.indexOf(e)==t});a(null,t)}})}},{key:"fetchCuisines",value:function(a){o.fetchRestaurants(function(e,n){if(e)a(e,null);else{var r=n.map(function(e,t){return n[t].cuisine_type}),t=r.filter(function(e,t){return r.indexOf(e)==t});a(null,t)}})}},{key:"urlForRestaurant",value:function(e){return"./restaurant.html?id="+e.id}},{key:"restaurantId",value:function(e){return""+e.id}},{key:"imageUrlForRestaurant",value:function(e){return"/img/"+e.id+"-large.webp"}},{key:"mapMarkerForRestaurant",value:function(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:o.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return"http://localhost:1337/restaurants"}}]),o}();