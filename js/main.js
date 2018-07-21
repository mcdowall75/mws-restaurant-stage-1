let restaurants,neighborhoods,cuisines;var map,markers=[];document.addEventListener("DOMContentLoaded",()=>{fetchNeighborhoods(),fetchCuisines()});const fetchNeighborhoods=()=>{DBHelper.fetchNeighborhoods((e,i)=>{e?console.error(e):(self.neighborhoods=i,fillNeighborhoodsHTML())})},fillNeighborhoodsHTML=(e=self.neighborhoods)=>{const i=document.getElementById("neighborhoods-select");e.forEach(m=>{const r=document.createElement("option");r.innerHTML=m,r.value=m,i.append(r)})},fetchCuisines=()=>{DBHelper.fetchCuisines((e,i)=>{e?console.error(e):(self.cuisines=i,fillCuisinesHTML())})},fillCuisinesHTML=(e=self.cuisines)=>{const i=document.getElementById("cuisines-select");e.forEach(m=>{const r=document.createElement("option");r.innerHTML=m,r.value=m,i.append(r)})},initMap=()=>{self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),updateRestaurants(),google.maps.event.addDomListener(window,"load",addIframeTitle)},initStaticMap=()=>{let e=document.getElementById("staticMap");e.onmouseover=initMap};function addIframeTitle(){document.querySelector("iframe").title="map of the area"}const updateRestaurants=()=>{const e=document.getElementById("cuisines-select"),i=document.getElementById("neighborhoods-select"),m=document.getElementById("favourites-select"),r=e.selectedIndex,s=i.selectedIndex,t=e[r].value,u=i[s].value,v=m.checked;DBHelper.fetchRestaurantByCuisineAndNeighborhood(t,u,v,(w,x)=>{w?console.error(w):(resetRestaurants(x),fillRestaurantsHTML())})},resetRestaurants=e=>{self.restaurants=[];const i=document.getElementById("restaurants-list");i.innerHTML="",self.markers.forEach(m=>m.setMap(null)),self.markers=[],self.restaurants=e},fillRestaurantsHTML=(e=self.restaurants)=>{const i=document.getElementById("restaurants-list");let m=0;e.forEach(r=>{1>m?i.append(createRestaurantHTML(r)):i.append(createLazyRestaurantHTML(r)),m++}),addMarkersToMap(),createLazyListener(),initModal(),initFav()},createRestaurantHTML=e=>{const i=document.createElement("li");i.tabIndex=0;const m=document.createElement("picture"),r=document.createElement("source");r.srcset="./img/"+DBHelper.restaurantId(e)+"-small_x2.webp 2x, ./img/"+DBHelper.restaurantId(e)+"-small.webp",r.type="image/webp",m.append(r);const s=document.createElement("source");s.srcset="./img/"+DBHelper.restaurantId(e)+"-small_x2.jpg 2x, ./img/"+DBHelper.restaurantId(e)+"-small.jpg",s.type="image/jpeg",m.append(s);const t=document.createElement("img");t.className="restaurant-img",t.src="./img/"+DBHelper.restaurantId(e)+"-small.jpg";const u=e.name;t.alt=`photo of ${u} restaurant`,m.append(t),i.append(m);const v=document.createElement("h3");v.innerHTML=e.name,i.append(v);const w=document.createElement("p");w.innerHTML=e.neighborhood,i.append(w);const x=document.createElement("p");x.innerHTML=e.address,i.append(x);const y=document.createElement("a");y.innerHTML="View Details",y.setAttribute("aria-label","View Details about "+e.name),y.href=DBHelper.urlForRestaurant(e),y.className="linkBtn btn",i.append(y);const z=document.createElement("button");if(z.innerHTML="Review",z.setAttribute("aria-label","Review "+e.name),z.className="reviewBtn btn",z.dataset.restaurant=e.name,z.dataset.restaurantId=e.id,i.append(z),!0==e.is_favorite||"true"==e.is_favorite)var A="favBtn heart";else var A="favBtn emptyHeart";const B=document.createElement("img");return B.alt="Select Favourite",B.className=A,B.dataset.restaurantId=e.id,i.append(B),i},createLazyRestaurantHTML=e=>{const i=document.createElement("li");i.tabIndex=0;const m=document.createElement("picture"),r=document.createElement("source");r.srcset="",r.dataset.srcset="./img/"+DBHelper.restaurantId(e)+"-small_x2.webp 2x, ./img/"+DBHelper.restaurantId(e)+"-small.webp",r.type="image/webp",r.className="lazy",m.append(r);const s=document.createElement("source");s.srcset="",s.dataset.srcset="./img/"+DBHelper.restaurantId(e)+"-small_x2.jpg 2x, ./img/"+DBHelper.restaurantId(e)+"-small.jpg",s.type="image/jpeg",s.className="lazy",m.append(s);const t=document.createElement("img");t.className="restaurant-img lazy",t.src="",t.dataset.src="./img/"+DBHelper.restaurantId(e)+"-small.jpg";const u=e.name;t.alt=`photo of ${u} restaurant`,m.append(t),i.append(m);const v=document.createElement("h3");v.innerHTML=e.name,i.append(v);const w=document.createElement("p");w.innerHTML=e.neighborhood,i.append(w);const x=document.createElement("p");x.innerHTML=e.address,i.append(x);const y=document.createElement("a");y.innerHTML="View Details",y.setAttribute("aria-label","View Details about "+e.name),y.href=DBHelper.urlForRestaurant(e),y.className="linkBtn btn",i.append(y);const z=document.createElement("button");if(z.innerHTML="Review",z.setAttribute("aria-label","Review "+e.name),z.className="reviewBtn btn",z.dataset.restaurant=e.name,z.dataset.restaurantId=e.id,i.append(z),!0==e.is_favorite||"true"==e.is_favorite)var A="favBtn heart";else var A="favBtn emptyHeart";const B=document.createElement("img");return B.alt="Select Favourite",B.className=A,B.dataset.restaurantId=e.id,i.append(B),i},addMarkersToMap=(e=self.restaurants)=>{e.forEach(i=>{const m=DBHelper.mapMarkerForRestaurant(i,self.map);google.maps.event.addListener(m,"click",()=>{window.location.href=m.url}),self.markers.push(m)})},createLazyListener=()=>{var e=[].slice.call(document.querySelectorAll("img.lazy")),i=[].slice.call(document.querySelectorAll("source.lazy"));if("IntersectionObserver"in window){let m=new IntersectionObserver(function(s){s.forEach(function(t){if(t.isIntersecting){let u=t.target;u.src=u.dataset.src,u.classList.remove("lazy"),m.unobserve(u)}})}),r=new IntersectionObserver(function(s){s.forEach(function(t){if(t.isIntersecting){let u=t.target;u.srcset=u.dataset.srcset,u.classList.remove("lazy"),m.unobserve(u)}})});e.forEach(function(s){m.observe(s)}),i.forEach(function(s){r.observe(s)})}};function initModal(){var e=document.getElementById("reviewModal"),i=document.getElementsByClassName("close"),m=function(t){t.preventDefault(),e.style.display="none"};for(let t of i)t.addEventListener("click",m,!1);window.onclick=function(t){t.target==e&&(e.style.display="none")};var r=document.getElementsByClassName("reviewBtn"),s=function(t){t.preventDefault();var u=document.getElementById("reviewHeader");u.innerHTML="Submit a review for: <span class='formTitle'>"+t.target.dataset.restaurant+"</span>",u.dataset.restaurantId=t.target.dataset.restaurantId,e.style.display="block"};for(let t of r)t.addEventListener("click",s,!1)}function initFav(){var e=document.getElementsByClassName("favBtn");for(let i of e)i.addEventListener("click",function(){var m=i.classList;if(i.classList.toggle("emptyHeart"),i.classList.toggle("heart"),"heart"==m[1])var r=!0;else var r=!1;var s=i.dataset.restaurantId;let t=DBHelper.openDatabase();DBHelper.postData(`http://localhost:1337/restaurants/${s}/?is_favorite=${r}`,`PUT`).then(u=>DBHelper.dbUpdate(u,t)).catch(u=>console.log(u))})}function initShowFav(){var e=document.getElementById("favourites-select");e.addEventListener("click",function(){e.parentElement.classList.toggle("checked"),updateRestaurants()})}if(window.onload=function(){initShowFav(),initStaticMap(),updateRestaurants()},"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("./sw.js").then(function(e){console.log("ServiceWorker registration successful with scope: ",e.scope)},function(e){console.log("ServiceWorker registration failed: ",e)})}),window.addEventListener("online",function(){navigator.serviceWorker.ready.then(function(e){return e.sync.register("processReviews")})},!1),"serviceWorker"in navigator)navigator.serviceWorker.ready.then(function(e){var i=document.querySelector("#reviewForm");i.addEventListener("submit",function(m){m.preventDefault;try{if(""==i.querySelector("#name").value)return alert("Please enter your name"),!1;if(""==i.querySelector("#review").value)return alert("Please enter your review"),!1;var r=document.getElementById("reviewModal");let u=document.getElementsByName("rating");for(var s=0,t=u.length;s<t;s++)if(u[s].checked){score=u[s].value;break}let v=document.getElementById("reviewHeader").dataset.restaurantId,w={restaurant_id:v,name:i.querySelector("#name").value,rating:score,comments:i.querySelector("#review").value};r.style.display="none";let x=DBHelper.openTempReviewDatabase();DBHelper.dbTempReviewStore(w,x).then(()=>{e.sync.register("processReviews").then(()=>{console.log("Sync Registered"),i.reset()})})}catch(u){throw new Error(u.message)}})});else{console.log("Service workers are not supported.");var form=document.querySelector("#reviewForm");form.addEventListener("submit",function(e){e.preventDefault;try{if(""==form.querySelector("#name").value)return alert("Please enter your name"),!1;if(""==form.querySelector("#review").value)return alert("Please enter your review"),!1;var i=document.getElementById("reviewModal");let s=document.getElementsByName("rating");for(var m=0,r=s.length;m<r;m++)if(s[m].checked){score=s[m].value;break}let t=document.getElementById("reviewHeader").dataset.restaurantId,u={restaurant_id:t,name:form.querySelector("#name").value,rating:score,comments:form.querySelector("#review").value};i.style.display="none",DBHelper.postData(`http://localhost:1337/reviews/`,`POST`,review),form.reset()}catch(s){throw new Error(s.message)}})}