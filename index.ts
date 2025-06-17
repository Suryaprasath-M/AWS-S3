import express from 'express';
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

mongoose.connect('mongodb://localhost:27017/DemoAwsS3') // replace with yours
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));


const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
