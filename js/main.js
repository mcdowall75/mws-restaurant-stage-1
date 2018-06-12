'use strict';var restaurants,neighborhoods,cuisines,map,markers=[];document.addEventListener('DOMContentLoaded',function(){fetchNeighborhoods(),fetchCuisines()});var fetchNeighborhoods=function(){DBHelper.fetchNeighborhoods(function(a,b){a?console.error(a):(self.neighborhoods=b,fillNeighborhoodsHTML())})},fillNeighborhoodsHTML=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:self.neighborhoods,b=document.getElementById('neighborhoods-select');a.forEach(function(c){var d=document.createElement('option');d.innerHTML=c,d.value=c,b.append(d)})},fetchCuisines=function(){DBHelper.fetchCuisines(function(a,b){a?console.error(a):(self.cuisines=b,fillCuisinesHTML())})},fillCuisinesHTML=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:self.cuisines,b=document.getElementById('cuisines-select');a.forEach(function(c){var d=document.createElement('option');d.innerHTML=c,d.value=c,b.append(d)})},initMap=function(){self.map=new google.maps.Map(document.getElementById('map'),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),updateRestaurants(),google.maps.event.addDomListener(window,'load',addIframeTitle)},initStaticMap=function(){var a=document.getElementById('staticMap');a.onmouseover=initMap};function addIframeTitle(){document.querySelector('iframe').title='map of the area'}var updateRestaurants=function(){var a=document.getElementById('cuisines-select'),b=document.getElementById('neighborhoods-select'),c=a.selectedIndex,d=b.selectedIndex,e=a[c].value,f=b[d].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(e,f,function(g,h){g?console.error(g):(resetRestaurants(h),fillRestaurantsHTML())})},resetRestaurants=function(a){self.restaurants=[];var b=document.getElementById('restaurants-list');b.innerHTML='',self.markers.forEach(function(c){return c.setMap(null)}),self.markers=[],self.restaurants=a},fillRestaurantsHTML=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:self.restaurants,b=document.getElementById('restaurants-list'),c=0;a.forEach(function(d){1>c?b.append(createRestaurantHTML(d)):b.append(createLazyRestaurantHTML(d)),c++}),addMarkersToMap(),createLazyListener()},createRestaurantHTML=function(a){var b=document.createElement('li');b.tabIndex=0;var c=document.createElement('picture'),d=document.createElement('source');d.srcset='/img/'+DBHelper.restaurantId(a)+'-small_x2.webp 2x, /img/'+DBHelper.restaurantId(a)+'-small.webp',d.type='image/webp',c.append(d);var e=document.createElement('source');e.srcset='/img/'+DBHelper.restaurantId(a)+'-small_x2.jpg 2x, /img/'+DBHelper.restaurantId(a)+'-small.jpg',e.type='image/jpeg',c.append(e);var f=document.createElement('img');f.className='restaurant-img',f.src='/img/'+DBHelper.restaurantId(a)+'-small.jpg';var g=a.name;f.alt='photo of '+g+' restaurant',c.append(f),b.append(c);var h=document.createElement('h3');h.innerHTML=a.name,b.append(h);var j=document.createElement('p');j.innerHTML=a.neighborhood,b.append(j);var k=document.createElement('p');k.innerHTML=a.address,b.append(k);var l=document.createElement('a');return l.innerHTML='View Details',l.setAttribute('aria-label','View Details about '+a.name),l.href=DBHelper.urlForRestaurant(a),b.append(l),b},createLazyRestaurantHTML=function(a){var b=document.createElement('li');b.tabIndex=0;var c=document.createElement('picture'),d=document.createElement('source');d.srcset='',d.dataset.srcset='/img/'+DBHelper.restaurantId(a)+'-small_x2.webp 2x, /img/'+DBHelper.restaurantId(a)+'-small.webp',d.type='image/webp',d.className='lazy',c.append(d);var e=document.createElement('source');e.srcset='',e.dataset.srcset='/img/'+DBHelper.restaurantId(a)+'-small_x2.jpg 2x, /img/'+DBHelper.restaurantId(a)+'-small.jpg',e.type='image/jpeg',e.className='lazy',c.append(e);var f=document.createElement('img');f.className='restaurant-img lazy',f.src='',f.dataset.src='/img/'+DBHelper.restaurantId(a)+'-small.jpg';var g=a.name;f.alt='photo of '+g+' restaurant',c.append(f),b.append(c);var h=document.createElement('h3');h.innerHTML=a.name,b.append(h);var j=document.createElement('p');j.innerHTML=a.neighborhood,b.append(j);var k=document.createElement('p');k.innerHTML=a.address,b.append(k);var l=document.createElement('a');return l.innerHTML='View Details',l.setAttribute('aria-label','View Details about '+a.name),l.href=DBHelper.urlForRestaurant(a),b.append(l),b},addMarkersToMap=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:self.restaurants;a.forEach(function(b){var c=DBHelper.mapMarkerForRestaurant(b,self.map);google.maps.event.addListener(c,'click',function(){window.location.href=c.url}),self.markers.push(c)})},createLazyListener=function(){var a=[].slice.call(document.querySelectorAll('img.lazy')),b=[].slice.call(document.querySelectorAll('source.lazy'));if('IntersectionObserver'in window){var c=new IntersectionObserver(function(e){e.forEach(function(g){if(g.isIntersecting){var h=g.target;h.src=h.dataset.src,h.classList.remove('lazy'),c.unobserve(h)}})}),d=new IntersectionObserver(function(e){e.forEach(function(g){if(g.isIntersecting){var h=g.target;h.srcset=h.dataset.srcset,h.classList.remove('lazy'),c.unobserve(h)}})});a.forEach(function(e){c.observe(e)}),b.forEach(function(e){d.observe(e)})}};window.onload=function(){initStaticMap(),updateRestaurants()},'serviceWorker'in navigator&&window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').then(function(a){console.log('ServiceWorker registration successful with scope: ',a.scope)},function(a){console.log('ServiceWorker registration failed: ',a)})});