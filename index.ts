import express, { Request, Response } from 'express';
// import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './src/router/index.router'; //this is your main router
import fileRouter from './src/router/file.router'; // Import the file router

const app = express();

app.use(cors());
app.use(express.json());

// Use router, not controller function directly
app.use('/api', userRouter);
app.use('/api',fileRouter); // Serve static files from 'uploads' directory

// Use userRouter for all routes under /api
app.get('/', (_req: Request, res: Response): void => {
  res.send(' Image upload was successfully added and server is running successfully!');
});

//mongodb compass Access URI example:
// mongodb://localhost:27017/DemoAwsS3

// Connect to MongoDB atlas cluster
mongoose.connect('mongodb+srv://DemoAws:DemoAwsS3@demo.gi9xibv.mongodb.net/?retryWrites=true&w=majority&appName=Demo')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));



const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
