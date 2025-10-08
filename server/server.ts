import dotenv from 'dotenv';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;

// Middleware
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('backend server works');
});

app.listen(PORT, () => {
    console.log(`Backend server started @ port ${PORT}`);
})