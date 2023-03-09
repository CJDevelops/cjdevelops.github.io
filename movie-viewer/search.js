// Get elements from the DOM
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const filmDirectory = document.getElementById("film-directory");
const searchResults = document.getElementById("search-results");

// Add event listener to search button
searchBtn.addEventListener("click", searchFilms);
// Add event listener to search bar input
searchBar.addEventListener("keydown", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault(); // prevent default form submit behavior
		searchFilms();
	}
});

// Function to search for films
function searchFilms() {
	const searchTerm = searchBar.value.toLowerCase();
	const links = filmDirectory.getElementsByTagName("a");
	const results = [];

	// Add "Searching" text
	const searchingText = document.createElement("p");
	searchingText.textContent = "Searching...";
	searchResults.innerHTML = "";
	searchResults.appendChild(searchingText);

	// Hide film directory
	filmDirectory.classList.add("hidden");

	// Loop through each film's information page
	for (let i = 0; i < links.length; i++) {
		const url = links[i].href;

		// Load content of film's information page
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.onload = function () {
			if (xhr.status === 200) {
				// Search loaded content for search term
				const content = xhr.responseText.toLowerCase();
				if (content.includes(searchTerm)) {
					results.push(links[i].parentElement);
				}
			}
			// Remove "Searching" text, show film directory, and display search results
			if (i === links.length - 1) {
				searchResults.removeChild(searchingText);
				filmDirectory.classList.remove("hidden");
				searchBar.value = "";
				displayResults(results);
			}
		};
		xhr.send();
	}
}

function displayResults(results) {
	const filmDirectory = document.getElementById("film-directory");
	const searchResults = document.getElementById("search-results");
	searchResults.innerHTML = "";

	if (results.length > 0) {
		results.forEach((result) => {
			searchResults.appendChild(result);
		});

		filmDirectory.style.display = "none";
		searchResults.style.display = "inline-block";
	} else {
		searchResults.style.display = "none";
		filmDirectory.style.display = "inline-block";
	}
}
