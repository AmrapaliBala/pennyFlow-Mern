import express from 'express'
import rateLimit from 'express-rate-limit'
import {
  googleLogin,
  loginUser,
  requestPasswordReset,
  registerUser,
  resetPassword,
  verifyPasswordResetOtp,
} from '../controllers/authController.js'

const router = express.Router()

const recoveryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many recovery attempts. Please try again later.',
  },
})

const googleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many sign-in attempts. Please try again later.',
  },
})

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgot-password/request', recoveryLimiter, requestPasswordReset)
router.post('/forgot-password/verify', recoveryLimiter, verifyPasswordResetOtp)
router.post('/forgot-password/reset', recoveryLimiter, resetPassword)
router.post('/google', googleAuthLimiter, googleLogin)

export default router
