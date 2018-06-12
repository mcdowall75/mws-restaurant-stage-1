'use strict';var restaurant,map;window.initMap=function(){fetchRestaurantFromURL(function(a,b){if(a)console.error(a);else{console.log(b.latlng),self.map=new google.maps.Map(document.getElementById('map'),{zoom:16,center:b.latlng,scrollwheel:!1}),fillBreadcrumb();DBHelper.mapMarkerForRestaurant(b,self.map)}})};function addIframeTitle(){document.querySelector('iframe').title='map of the area'}var fetchRestaurantFromURL=function(a){if(self.restaurant)return void a(null,self.restaurant);var b=getParameterByName('id');b?DBHelper.fetchRestaurantById(b,function(c,d){return self.restaurant=d,d?void(fillRestaurantHTML(),a(null,d)):void console.error(c)}):(error='No restaurant id in URL',a(error,null))},fillRestaurantHTML=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:self.restaurant,b=document.getElementById('restaurant-name');b.innerHTML=a.name,b.tabIndex=0;var c=document.getElementById('restaurant-address');c.innerHTML=a.address,c.tabIndex=0;var d=document.getElementById('restaurant-img');d.className='restaurant-img';var e=a.name;d.alt='photo of '+e+' restaurant',d.src=DBHelper.imageUrlForRestaurant(a);var f=document.getElementById('restaurant-cuisine');f.innerHTML=a.cuisine_type,f.tabIndex=0,a.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()},fillRestaurantHoursHTML=function(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,b=document.getElementById('restaurant-hours');for(var c in b.tabIndex=0,a){var d=document.createElement('tr'),e=document.createElement('td');e.innerHTML=c,d.appendChild(e);var f=document.createElement('td');f.innerHTML=a[c],d.appendChild(f),b.appendChild(d)}},fillReviewsHTML=function(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,b=document.getElementById('reviews-container'),c=document.createElement('h3');if(c.innerHTML='Reviews',c.tabIndex=0,b.appendChild(c),!a){var d=document.createElement('p');return d.innerHTML='No reviews yet!',d.tabIndex=0,void b.appendChild(d)}var e=document.getElementById('reviews-list');a.forEach(function(f){e.appendChild(createReviewHTML(f))}),b.appendChild(e)},createReviewHTML=function(a){var b=document.createElement('li'),c=document.createElement('div');c.className='ReviewListTop';var d=document.createElement('div');d.className='listTitleLeft',d.innerHTML=a.name,d.tabIndex=0,c.appendChild(d);var e=document.createElement('div');e.className='listTitleRight',e.innerHTML=a.date,e.tabIndex=0,c.appendChild(e),b.appendChild(c);var f=document.createElement('div');f.className='rating',f.innerHTML='Rating: '+a.rating,f.tabIndex=0,b.appendChild(f);var g=document.createElement('p');return g.innerHTML=a.comments,g.tabIndex=0,b.appendChild(g),b},fillBreadcrumb=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:self.restaurant,b=document.getElementById('breadcrumb'),c=document.createElement('li');c.innerHTML=a.name,c.setAttribute('aria-current','page'),b.appendChild(c)},getParameterByName=function(a,b){b||(b=window.location.href),a=a.replace(/[\[\]]/g,'\\$&');var c=new RegExp('[?&]'+a+'(=([^&#]*)|&|#|$)'),d=c.exec(b);return d?d[2]?decodeURIComponent(d[2].replace(/\+/g,' ')):'':null};