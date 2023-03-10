const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const filmDirectory = document.getElementById("film-directory");
const searchResults = document.getElementById("search-results");

// Add event listeners
searchBtn.addEventListener("click", searchFilms);
searchBar.addEventListener("keydown", handleSearchBarKeydown);
resetBtn.addEventListener("click", resetPage);

// Function to handle "Enter" key press in search bar
function handleSearchBarKeydown(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		searchFilms();
	}
}

function resetPage() {
	// Clear search results and show film directory
	searchResults.innerHTML = "";
	searchResults.classList.add("hidden");
	filmDirectory.classList.remove("hidden");
}

async function searchFilms() {
	const searchTerm = searchBar.value.toLowerCase();
	const links = filmDirectory.getElementsByTagName("a");

	// Reset page if search term is empty
	if (searchTerm === "") {
		resetPage();
		return;
	}

	// Add "Searching" text
	searchResults.innerHTML = "<p>Searching...</p>";

	// Hide film directory
	filmDirectory.classList.add("hidden");

	// Load and search each film's information page in parallel using Promise.all
	const requests = Array.from(links).map((link) => fetch(link.href));
	let resultsFound = 0; // Counter for number of results found
	for (let i = 0; i < requests.length; i++) {
		const response = await requests[i];
		if (response.ok) {
			const content = await response.text();
			if (content.toLowerCase().includes(searchTerm)) {
				const filmElement = links[i].parentElement.cloneNode(true);
				searchResults.appendChild(filmElement);
				filmDirectory.classList.add("hidden");
				searchResults.classList.remove("hidden");
				resultsFound++; // Increment counter if a result is found
			}
		}
	}

	// Clear Search Bar and Display "Search Complete" or "No results Found"
	searchBar.value = "";
	const searchComplete = document.createElement("p");
	if (resultsFound > 0) {
		searchComplete.textContent = "Search Complete";
	} else {
		searchComplete.textContent = "No results Found";
	}
	searchResults.replaceChild(searchComplete, searchResults.firstChild);
}
