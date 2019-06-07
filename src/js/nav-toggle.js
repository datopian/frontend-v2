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
