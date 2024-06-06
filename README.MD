# City Suggestions API

This is a Node.js application that provides auto-complete suggestions for the names of large cities. The application exposes a REST API endpoint that returns scored suggestions based on a partial or complete search term.

## Features

- Exposes an endpoint `/suggestions` to get city name suggestions
- Accepts query parameters `q` (search term), `latitude`, and `longitude`
- Returns suggestions sorted by descending score
- Each suggestion includes a score, name, latitude, and longitude
- Scores are between 0 and 1 (inclusive), indicating confidence in the suggestion
- Optional location parameters (latitude and longitude) improve relative scores

## Getting Started

### Prerequisites

- Node.js and npm installed
- Heroku CLI installed


### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/liamkande/citySuggestionsAPI-
   cd city-suggestions
2. Install dependencies:
   ```sh
   npm install
3. Start the server:
   ```sh
    npm start