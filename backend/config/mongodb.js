// backend/config/mongodb.js
import mongoose from 'mongoose'

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.')
  }

  try {
      const connection = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      })

    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch {
    throw new Error('Unable to connect to MongoDB.')
  }
}

export default connectDB
