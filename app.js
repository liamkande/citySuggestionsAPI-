const express = require('express');
const stringSimilarity = require('string-similarity');
const geolib = require('geolib');
const { cities, loadCities } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/suggestions', async (req, res) => {
    await loadCities; // Ensure cities data is loaded

    const query = req.query.q;
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);

    if (!query) {
        return res.json([]);
    }

    const suggestions = computeSuggestions(query, latitude, longitude);
    console.log('Suggestions:', suggestions); // Log suggestions for debugging
    res.json(suggestions);
});

function computeSuggestions(query, latitude, longitude) {
    const results = cities.map((city) => {
        if (!city.name) {
            return null; // Skip entries without a city name
        }

        let score = stringSimilarity.compareTwoStrings(query.toLowerCase(), city.name.toLowerCase());

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const distance = geolib.getDistance(
                { latitude, longitude },
                { latitude: parseFloat(city.lat), longitude: parseFloat(city.long) }
            );
            score *= Math.max(0, 1 - (distance / 2000000)); // Assume max relevance within 2000 km
        }

        return {
            name: city.name,
            latitude: parseFloat(city.lat),
            longitude: parseFloat(city.long),
            score: score,
        };
    });

    const validResults = results.filter(result => result !== null && result.score > 0);
    validResults.sort((a, b) => b.score - a.score);
    return validResults;
}

if (require.main === module) {
    loadCities.then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
}

module.exports = app;
