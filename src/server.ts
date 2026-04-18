import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello World from the Backend!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port} v1.0.0`);
});