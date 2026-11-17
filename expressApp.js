import express from 'express';

const app = express();

// Middleware to parse JSON data
app.use(express.json());
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
app.get('/foods', (req, res) => {
    res.status(200).json(foods);
});
app.get('/foods/:id', (req, res) => {

    const id = Number(req.params.id);

    const food = foods.find(item => item.id === id);

    if (!food) {
        return res.status(404).json({
            message: "Food item not found"
        });
    }

    res.status(200).json(food);
});
app.post('/foods', (req, res) => {

    const { id, foodName, category, price, availability } = req.body;

    if (
        !Number.isInteger(id) ||
        !foodName ||
        typeof foodName !== 'string' ||
        !category ||
        typeof category !== 'string' ||
        typeof price !== 'number' ||
        price <= 0 ||
        typeof availability !== 'boolean'
    ) {
        return res.status(400).json({
            message: "Invalid or missing food details"
        });
    }

    const existingFood = foods.find(item => item.id === id);

    if (existingFood) {
        return res.status(400).json({
            message: "Food ID already exists"
        });
    }

    const newFood = {
        id,
        foodName,
        category,
        price,
        availability
    };

    foods.push(newFood);

    res.status(201).json({
        message: "Food item added successfully",
        food: newFood
    });
});
app.put('/foods/:id', (req, res) => {

    const id = Number(req.params.id);

    const food = foods.find(item => item.id === id);

    if (!food) {
        return res.status(404).json({
            message: "Food item not found"
        });
    }

    const { foodName, category, price, availability } = req.body;

    const updatedFood = {
        ...food,
        ...req.body,
        id: food.id
    };

    if (
        (typeof updatedFood.foodName !== 'string' ||
            !updatedFood.foodName.trim()) ||
        (typeof updatedFood.category !== 'string' ||
            !updatedFood.category.trim()) ||
        typeof updatedFood.price !== 'number' ||
        updatedFood.price <= 0 ||
        typeof updatedFood.availability !== 'boolean'
    ) {
        return res.status(400).json({
            message: "Invalid food details"
        });
    }

    Object.assign(food, updatedFood);

    res.status(200).json({
        message: "Food item updated successfully",
        food: food
    });
});
app.delete('/foods/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = foods.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Food item not found"
        });
    }

    const deletedFood = foods.splice(index, 1);

    res.status(200).json({
        message: "Food item deleted successfully",
        food: deletedFood[0]
    });
});
// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    next(err);
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start Express server
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});