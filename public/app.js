document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    fetchSuggestions(query);
});

async function fetchSuggestions(query) {
    const response = await fetch(`/suggestions?q=${query}`);
    const suggestions = await response.json();
    displaySuggestions(suggestions);
}

function displaySuggestions(suggestions) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (suggestions.length === 0) {
        resultsContainer.innerHTML = '<p>No suggestions found</p>';
        return;
    }

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.classList.add('result-item');
        div.innerHTML = `<strong>${suggestion.name}</strong> (Lat: ${suggestion.latitude}, Long: ${suggestion.longitude}) - Score: ${suggestion.score.toFixed(2)}`;
        resultsContainer.appendChild(div);
    });
}
