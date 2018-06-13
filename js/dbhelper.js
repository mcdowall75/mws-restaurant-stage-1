/**
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
