import express from 'express'
import rateLimit from 'express-rate-limit'
import { getFinancialInsight } from '../controllers/insightsController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const insightsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user._id.toString(),
  message: {
    message: 'Too many insight requests. Please try again later.',
  },
})

router.post('/', protect, insightsLimiter, getFinancialInsight)

export default router
