'use strict';var _createClass=function(){function a(b,c){for(var e,d=0;d<c.length;d++)e=c[d],e.enumerable=e.enumerable||!1,e.configurable=!0,'value'in e&&(e.writable=!0),Object.defineProperty(b,e.key,e)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var DBHelper=function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:'openDatabase',value:function openDatabase(){if(!('indexedDB'in window))return void console.log('This browser doesn\'t support IndexedDB');var b=idb.open('restaurants-db',1,function(c){c.objectStoreNames.contains('restaurants')||(console.log('Create IndexedDB store'),c.createObjectStore('restaurants',{keyPath:'id'}))});return b}},{key:'dbStore',value:function dbStore(b,c){c.then(function(d){var e=d.transaction('restaurants','readwrite'),f=e.objectStore('restaurants');return f.add(b),e.complete}).then(function(){console.log('added item to the store restaurants!')})}},{key:'dbGetAll',value:function dbGetAll(b,c){b.then(function(d){var e=d.transaction('restaurants','readonly'),f=e.objectStore('restaurants');return f.getAll()}).then(function(d){c(d)})}},{key:'fetchRestaurants',value:function fetchRestaurants(b){var c=a.openDatabase();c.then(function(d){var e=d.transaction('restaurants','readonly'),f=e.objectStore('restaurants');return f.getAll()}).then(function(d){if(0==d.length){console.log('restaurants are empty');var e=new XMLHttpRequest;e.open('GET',a.DATABASE_URL),e.onload=function(){if(200===e.status){var g=JSON.parse(e.responseText);g.forEach(function(j){a.dbStore(j,c)}),b(null,g)}else{var h='Request failed. Returned status of '+e.status;b(h,null)}},e.send()}else a.dbGetAll(c,function(g){b(null,g)})})}},{key:'fetchRestaurantById',value:function fetchRestaurantById(b,c){a.fetchRestaurants(function(d,e){if(d)c(d,null);else{var f=e.find(function(g){return g.id==b});f?c(null,f):c('Restaurant does not exist',null)}})}},{key:'fetchRestaurantByCuisine',value:function fetchRestaurantByCuisine(b,c){a.fetchRestaurants(function(d,e){if(d)c(d,null);else{var f=e.filter(function(g){return g.cuisine_type==b});c(null,f)}})}},{key:'fetchRestaurantByNeighborhood',value:function fetchRestaurantByNeighborhood(b,c){a.fetchRestaurants(function(d,e){if(d)c(d,null);else{var f=e.filter(function(g){return g.neighborhood==b});c(null,f)}})}},{key:'fetchRestaurantByCuisineAndNeighborhood',value:function fetchRestaurantByCuisineAndNeighborhood(b,c,d){a.fetchRestaurants(function(e,f){if(e)d(e,null);else{var g=f;'all'!=b&&(g=g.filter(function(h){return h.cuisine_type==b})),'all'!=c&&(g=g.filter(function(h){return h.neighborhood==c})),d(null,g)}})}},{key:'fetchNeighborhoods',value:function fetchNeighborhoods(b){a.fetchRestaurants(function(c,d){if(c)b(c,null);else{var e=d.map(function(g,h){return d[h].neighborhood}),f=e.filter(function(g,h){return e.indexOf(g)==h});b(null,f)}})}},{key:'fetchCuisines',value:function fetchCuisines(b){a.fetchRestaurants(function(c,d){if(c)b(c,null);else{var e=d.map(function(g,h){return d[h].cuisine_type}),f=e.filter(function(g,h){return e.indexOf(g)==h});b(null,f)}})}},{key:'urlForRestaurant',value:function urlForRestaurant(b){return'./restaurant.html?id='+b.id}},{key:'restaurantId',value:function restaurantId(b){return''+b.id}},{key:'imageUrlForRestaurant',value:function imageUrlForRestaurant(b){return'/img/'+b.id+'-large.webp'}},{key:'mapMarkerForRestaurant',value:function mapMarkerForRestaurant(b,c){var d=new google.maps.Marker({position:b.latlng,title:b.name,url:a.urlForRestaurant(b),map:c,animation:google.maps.Animation.DROP});return d}},{key:'DATABASE_URL',get:function get(){return'http://localhost:'+1337+'/restaurants'}}]),a}();/**
* Common database helper functions.
*/
class DBHelper {

 /**
  * IndexDB Promises
  */

 static openDatabase() {

   //check for support
   if (!('indexedDB' in window)) {
     console.log('This browser doesn\'t support IndexedDB');
     return;
   }

   var dbPromise = idb.open('restaurants-db', 1, function(upgradeDb) {
     if (!upgradeDb.objectStoreNames.contains('restaurants')) {
       console.log('Create IndexedDB store');
       upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
     }
   });
   return dbPromise
 };

 static dbStore(item,dbPromise) {
       dbPromise.then(function(db) {
           var tx = db.transaction('restaurants', 'readwrite');
           var store = tx.objectStore('restaurants');
           store.add(item);
           return tx.complete;
       }).then(function() {
           console.log('added item to the store restaurants!');
       });
   }

   static dbGetAll(dbPromise,callback) {
       dbPromise.then(function(db) {
           var tx = db.transaction('restaurants', 'readonly');
           var store = tx.objectStore('restaurants');
           return store.getAll();
       }).then(function(items) {
           callback(items)
       });
   }



 /**
  * Database URL.
  * Change this to restaurants.json file location on your server.
  */
   static get DATABASE_URL() {
   const port = 1337 // Change this to your server port
   return `http://localhost:${port}/restaurants`;
 }

 /**
  * Fetch all restaurants.
  */
    static fetchRestaurants(callback) {
       let dbPromise =  DBHelper.openDatabase();
       dbPromise.then(function(db) {
           let tx = db.transaction('restaurants', 'readonly');
           let store = tx.objectStore('restaurants');
           return store.getAll();
       }).then(function(items) {
           if ( items.length == 0 ) {
               console.log('restaurants are empty')
               let xhr = new XMLHttpRequest();
               xhr.open('GET', DBHelper.DATABASE_URL);
               xhr.onload = () => {
                   if (xhr.status === 200) { // Got a success response from server!
                       const restaurants = JSON.parse(xhr.responseText);
                       restaurants.forEach(function(restaurant) {
                           DBHelper.dbStore(restaurant,dbPromise);
                       })
                       callback(null, restaurants);
                   } else { // Oops!. Got an error from server.
                       const error = (`Request failed. Returned status of ${xhr.status}`);
                       callback(error, null);
                   }
               };
               xhr.send();
           } else {
               let restaurants = DBHelper.dbGetAll(dbPromise,(restaurants) => {
                   callback(null, restaurants);
               });
           }
       });
   }

 /**
  * Fetch a restaurant by its ID.
  */
 static fetchRestaurantById(id, callback) {
   // fetch all restaurants with proper error handling.
   DBHelper.fetchRestaurants((error, restaurants) => {
     if (error) {
       callback(error, null);
     } else {
       const restaurant = restaurants.find(r => r.id == id);
       if (restaurant) { // Got the restaurant
         callback(null, restaurant);
       } else { // Restaurant does not exist in the database
         callback('Restaurant does not exist', null);
       }
     }
   });
 }

 /**
  * Fetch restaurants by a cuisine type with proper error handling.
  */
 static fetchRestaurantByCuisine(cuisine, callback) {
   // Fetch all restaurants  with proper error handling
   DBHelper.fetchRestaurants((error, restaurants) => {
     if (error) {
       callback(error, null);
     } else {
       // Filter restaurants to have only given cuisine type
       const results = restaurants.filter(r => r.cuisine_type == cuisine);
       callback(null, results);
     }
   });
 }

 /**
  * Fetch restaurants by a neighborhood with proper error handling.
  */
 static fetchRestaurantByNeighborhood(neighborhood, callback) {
   // Fetch all restaurants
   DBHelper.fetchRestaurants((error, restaurants) => {
     if (error) {
       callback(error, null);
     } else {
       // Filter restaurants to have only given neighborhood
       const results = restaurants.filter(r => r.neighborhood == neighborhood);
       callback(null, results);
     }
   });
 }

 /**
  * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
  */
 static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
   // Fetch all restaurants
   DBHelper.fetchRestaurants((error, restaurants) => {
     if (error) {
       callback(error, null);
     } else {
       let results = restaurants
       if (cuisine != 'all') { // filter by cuisine
         results = results.filter(r => r.cuisine_type == cuisine);
       }
       if (neighborhood != 'all') { // filter by neighborhood
         results = results.filter(r => r.neighborhood == neighborhood);
       }
       callback(null, results);
     }
   });
 }

 /**
  * Fetch all neighborhoods with proper error handling.
  */
 static fetchNeighborhoods(callback) {
   // Fetch all restaurants
   DBHelper.fetchRestaurants((error, restaurants) => {
     if (error) {
       callback(error, null);
     } else {
       // Get all neighborhoods from all restaurants
       const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
       // Remove duplicates from neighborhoods
       const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
       callback(null, uniqueNeighborhoods);
     }
   });
 }

 /**
  * Fetch all cuisines with proper error handling.
  */
 static fetchCuisines(callback) {
   // Fetch all restaurants
   DBHelper.fetchRestaurants((error, restaurants) => {
     if (error) {
       callback(error, null);
     } else {
       // Get all cuisines from all restaurants
       const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
       // Remove duplicates from cuisines
       const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
       callback(null, uniqueCuisines);
     }
   });
 }

 /**
  * Restaurant page URL.
  */
 static urlForRestaurant(restaurant) {
   return (`./restaurant.html?id=${restaurant.id}`);
 }

 /**
  * Restaurant id.
  */
 static restaurantId(restaurant) {
   return (`${restaurant.id}`);
 }

 /**
  * Restaurant image URL.
  */
 static imageUrlForRestaurant(restaurant) {
   return (`/img/${restaurant.id}-large.webp`);
 }

 /**
  * Map marker for a restaurant.
  */
 static mapMarkerForRestaurant(restaurant, map) {
   const marker = new google.maps.Marker({
     position: restaurant.latlng,
     title: restaurant.name,
     url: DBHelper.urlForRestaurant(restaurant),
     map: map,
     animation: google.maps.Animation.DROP}
   );
   return marker;
 }

}
