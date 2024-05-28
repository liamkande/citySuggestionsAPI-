const http = require('http');
const assert = require('assert');
const { loadCities } = require('./data');
const app = require('./app');

const PORT = 3000;

// Helper function to make GET requests
const makeGetRequest = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: 'GET',
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
};

// Start the server before running tests
const server = app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Ensure cities data is loaded
    await loadCities;

    // Define tests
    const tests = [
        {
            description: 'should return suggestions for a given query',
            path: '/suggestions?q=abbot',
            test: (response) => {
                assert.strictEqual(response.statusCode, 200);
                assert(response.body.length > 0);
                assert(response.body[0].name.toLowerCase().includes('abbot'));
            },
        },
        {
            description: 'should return an empty array if no query is provided',
            path: '/suggestions',
            test: (response) => {
                assert.strictEqual(response.statusCode, 200);
                assert.deepStrictEqual(response.body, []);
            },
        },
        {
            description: 'should handle case where no city names match',
            path: '/suggestions?q=nonexistentcity',
            test: (response) => {
                assert.strictEqual(response.statusCode, 200);
                assert.deepStrictEqual(response.body, []);
            },
        },
        {
            description: 'should consider latitude and longitude for scoring',
            path: '/suggestions?q=abbot&latitude=43.7&longitude=-79.4',
            test: (response) => {
                assert.strictEqual(response.statusCode, 200);
                assert(response.body.length > 0);
                assert(response.body[0].score > 0.5);
            },
        },
        {
            description: 'should return results with valid latitude and longitude',
            path: '/suggestions?q=abbot',
            test: (response) => {
                assert.strictEqual(response.statusCode, 200);
                assert(response.body.length > 0);
                response.body.forEach((suggestion) => {
                    assert.strictEqual(typeof suggestion.latitude, 'number');
                    assert.strictEqual(typeof suggestion.longitude, 'number');
                });
            },
        },
    ];

    // Run tests
    for (const test of tests) {
        try {
            console.log(`Running test: ${test.description}`);
            const response = await makeGetRequest(test.path);
            test.test(response);
            console.log(`Test passed: ${test.description}`);
        } catch (error) {
            console.error(`Test failed: ${test.description}`);
            console.error(error);
        }
    }

    // Close the server after tests
    server.close(() => {
        console.log('Server closed');
    });
});
