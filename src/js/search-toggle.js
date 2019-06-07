// replace link with a button
var searchLink = document.getElementById("search-link");
var searchButton = document.createElement("button");
searchButton.setAttribute("id", "show-search");

while (searchLink.childNodes.length > 0) {
  searchButton.appendChild(searchLink.childNodes[0]);
}

searchLink.replaceWith(searchButton);

// TODO: implement a modal
