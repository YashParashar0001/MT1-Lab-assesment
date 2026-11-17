
import http from 'http';
import fs from 'fs';

// Sample food records
let foods = [
    {
        id: 1,
        foodName: "Pizza",
        category: "Fast Food",
        price: 250,
        availability: true
    },
    {
        id: 2,
        foodName: "Burger",
        category: "Fast Food",
        price: 150,
        availability: true
    },
    {
        id: 3,
        foodName: "Pasta",
        category: "Italian",
        price: 200,
        availability: false
    }
];

// Helper function to send JSON responses
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(data));
}

// Create HTTP server
const server = http.createServer((req, res) => {

    const { method, url } = req;

    // GET /
    if (method === 'GET' && url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>Welcome to Food Ordering Application</h1>
            <p>Order your favourite food here!</p>
        `);
    }

    // GET /foods
    else if (method === 'GET' && url === '/foods') {
        const availableFoods = foods.filter(
            food => food.availability === true
        );

        sendJSON(res, 200, availableFoods);
    }

    // GET /about
    else if (method === 'GET' && url === '/about') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>About Our Restaurant</h1>
            <p>We serve delicious food at affordable prices.</p>
        `);
    }

    // GET /menu
    else if (method === 'GET' && url === '/menu') {
        fs.readFile('./public/menu.html', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Error reading menu file');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.end(data);
        });
    }

    // POST /add-food
    else if (method === 'POST' && url === '/add-food') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newFood = JSON.parse(body);

                const { id, foodName, category, price, availability } = newFood;

                if (
                    id === undefined ||
                    !foodName ||
                    !category ||
                    price === undefined ||
                    typeof availability !== 'boolean'
                ) {
                    sendJSON(res, 400, {
                        message: 'All required fields are necessary'
                    });
                    return;
                }

                if (
                    !Number.isInteger(id) ||
                    !Number.isFinite(price) ||
                    price <= 0 ||
                    foods.some(food => food.id === id)
                ) {
                    sendJSON(res, 400, {
                        message: 'Invalid ID, duplicate ID or price'
                    });
                    return;
                }

                foods.push(newFood);

                sendJSON(res, 201, {
                    message: 'Food added successfully',
                    food: newFood
                });

            } catch (error) {
                sendJSON(res, 400, {
                    message: 'Invalid JSON format'
                });
            }
        });
    }

    // Invalid routes
    else {
        sendJSON(res, 404, {
            message: 'Route not found'
        });
    }
});

// Start server
server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
