import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import connectDB from './config/mongodb.js'
import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import insightsRoutes from './routes/insightsRoutes.js'

const app = express()
app.set('trust proxy', 1);
const port = process.env.PORT || 5000
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({ origin: frontendUrl,}),)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'PennyFlow API is running.',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/insights', insightsRoutes)
app.use((req, res) => {res.status(404).json({message: 'Route not found.',})})
app.use((error, req, res, next) => {console.error('Unhandled server error.')
res.status(500).json({message: 'An unexpected server error occurred.',})})

async function startServer() {
  try {
    await connectDB()
    app.listen(port, () => {console.log(`Server running on port ${port}`)})
  } catch {
    console.error('Server could not start because MongoDB connection failed.')
    process.exit(1)
  }
}
startServer()