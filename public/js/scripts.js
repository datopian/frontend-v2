var filterToggle = document.getElementById("filter-toggle");
var filterTarget = filterToggle.nextElementSibling;

// hide filters
filterTarget.setAttribute("data-expanded", "false");

// show toggle
filterToggle.classList.remove("invisible");

// toggle filters with button
filterToggle.onclick = function() {
  let expanded = filterToggle.getAttribute('aria-expanded') === 'true' || false;
  filterToggle.setAttribute('aria-expanded', !expanded);
  filterTarget.setAttribute("data-expanded", !expanded);
}

var navToggle = document.getElementById("nav-toggle");
var navTarget = navToggle.nextElementSibling;

// show toggle
navToggle.classList.remove("invisible");

// hide nav
navTarget.setAttribute("data-expanded", "false");

// toggle nav
navToggle.onclick = function() {
  let expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
  navToggle.setAttribute('aria-expanded', !expanded);
  navTarget.setAttribute("data-expanded", !expanded);
}

// replace link with a button
var searchLink = document.getElementById("search-link");
var searchButton = document.createElement("button");
searchButton.setAttribute("id", "show-search");

while (searchLink.childNodes.length > 0) {
  searchButton.appendChild(searchLink.childNodes[0]);
}

searchLink.replaceWith(searchButton);

// TODO: implement a modal
