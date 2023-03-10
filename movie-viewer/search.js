const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const filmDirectory = document.getElementById("film-directory");
const searchResults = document.getElementById("search-results");

// Add event listeners
searchBtn.addEventListener("click", searchFilms);
resetBtn.addEventListener("click", resetPage);
searchBar.addEventListener("keydown", handleSearchBarKeydown);

// Function to handle "Enter" key press in search bar
function handleSearchBarKeydown(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		searchFilms();
	}
}

// Helper function to enable / disable a "hidden" class on items
function toggleHidden(...elements) {
	for (const [element, shouldHide] of elements) {
		if (shouldHide) {
			element.classList.add("hidden");
		} else {
			element.classList.remove("hidden");
		}
	}
}

function resetPage() {
	// Clear search results and show film directory
	searchResults.innerHTML = "";
	toggleHidden([filmDirectory, false], [searchResults, true]);
}

async function searchFilms() {
	const searchTerm = searchBar.value.toLowerCase();
	const links = filmDirectory.getElementsByTagName("a");

	// Reset page if search term is empty
	if (searchTerm === "") return resetPage();

	// Add "Searching" text and hide the film directory
	searchResults.innerHTML = "<p>Searching...</p>";
	toggleHidden([filmDirectory, true]);

	// Make a list of every page to search
	const requests = Array.from(links).map((link) => fetch(link.href));
	let resultsFound = 0; // Counter for number of results found

	// Loop over each request, if the page text includes searchTerm
	// If searchTerm found then add it to the searchResults element
	// Toggle the filmDirectory off and the searchResults on
	for (let i = 0; i < requests.length; i++) {
		const response = await requests[i];
		if (response.ok) {
			const content = await response.text();
			if (content.toLowerCase().includes(searchTerm)) {
				searchResults.appendChild(links[i].parentElement.cloneNode(true));
				toggleHidden([filmDirectory, true], [searchResults, false]);
				resultsFound++; // Increment counter if a result is found
			}
		}
	}

	// Clear Search Bar and Display "Search Complete" or "No results Found"
	searchBar.value = "";
	const searchComplete = document.createElement("p");
	searchComplete.textContent = resultsFound > 0 ? "Search Complete" : "No results Found";
	searchResults.replaceChild(searchComplete, searchResults.firstChild);
}
