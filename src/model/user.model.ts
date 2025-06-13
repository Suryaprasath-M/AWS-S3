import express from 'express';
import mongoose, { Schema,  Document } from 'mongoose';

export interface UserDetails extends Document {
  email: string;
  username: string;
  password: string;
 

}

const userSchema = new mongoose.Schema<UserDetails>({
    email: { type: String, required: true },  
    username: { type: String, required: true },
    password: { type: String, required: true }
});

export default mongoose.model<UserDetails>('User', userSchema);
