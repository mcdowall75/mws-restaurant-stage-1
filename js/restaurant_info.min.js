'use strict';

var restaurant = void 0;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
  fetchRestaurantFromURL(function (error, restaurant) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      console.log(restaurant.latlng);
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      var marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    }
  });
};

function addIframeTitle() {
  document.querySelector('iframe').title = 'map of the area';
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  var id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, function (error, restaurant) {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = function fillRestaurantHTML() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  var name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.tabIndex = 0;

  var address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.tabIndex = 0;

  var image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  var restName = restaurant.name;
  image.alt = 'photo of ' + restName + ' restaurant';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  var cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.tabIndex = 0;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {
  var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;

  var hours = document.getElementById('restaurant-hours');
  hours.tabIndex = 0;
  for (var key in operatingHours) {
    var row = document.createElement('tr');

    var day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    var time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = function fillReviewsHTML() {
  var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;

  var container = document.getElementById('reviews-container');
  var title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  title.tabIndex = 0;
  container.appendChild(title);

  if (!reviews) {
    var noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    noReviews.tabIndex = 0;
    container.appendChild(noReviews);
    return;
  }
  var ul = document.getElementById('reviews-list');
  reviews.forEach(function (review) {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = function createReviewHTML(review) {
  var li = document.createElement('li');
  var outerdiv = document.createElement('div');
  outerdiv.className = "ReviewListTop";
  var name = document.createElement('div');
  name.className = "listTitleLeft";
  name.innerHTML = review.name;
  name.tabIndex = 0;
  outerdiv.appendChild(name);

  var date = document.createElement('div');
  date.className = "listTitleRight";
  date.innerHTML = review.date;
  date.tabIndex = 0;
  outerdiv.appendChild(date);
  li.appendChild(outerdiv);

  var rating = document.createElement('div');
  rating.className = "rating";
  rating.innerHTML = 'Rating: ' + review.rating;
  rating.tabIndex = 0;
  li.appendChild(rating);

  var comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.tabIndex = 0;
  li.appendChild(comments);
  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = function fillBreadcrumb() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  var breadcrumb = document.getElementById('breadcrumb');
  var li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};