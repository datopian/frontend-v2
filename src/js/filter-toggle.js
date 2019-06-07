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
