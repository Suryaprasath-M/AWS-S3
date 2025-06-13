import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './src/router/index.router'; // ✅ this is your main router

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use router, not controller function directly
app.use('/api', userRouter);

mongoose.connect('mongodb+srv://Surya:Surya123@demo4.uuak19v.mongodb.net/?retryWrites=true&w=majority&appName=demo4') // replace with yours
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));


const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
