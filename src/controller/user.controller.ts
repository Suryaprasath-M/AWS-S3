import { Request, Response} from 'express';
import User from '../model/user.model'; 
import { sendTokenAsCookie } from '../middleware/authentication'; // Reuse your utility
import { comparePasswords, hashPassword } from '../middleware/bcrypt.util'; // Reuse your utility

const JWT_SECRET = "hardcoded_secret_key"; // Don't use env here

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, confirmpassword } = req.body;

  try {
    if (!username || !email || !password || !confirmpassword) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (password !== confirmpassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ You wanted to keep sendTokenAsCookie here
    sendTokenAsCookie(res, { id: newUser._id });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};



