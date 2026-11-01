import crypto from 'node:crypto'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import PasswordReset from '../models/PasswordReset.js'
import User from '../models/User.js'
import { sendPasswordResetOtp } from '../services/emailService.js'

const OTP_EXPIRY_MS = 10 * 60 * 1000
const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000
const MAX_OTP_ATTEMPTS = 5

const hashValue = (value) =>
  crypto.createHash('sha256').update(value).digest('hex')

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.')
  }

  return jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
}

const getAuthResponse = (user, message) => ({
  message,
  token: createToken(user),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
  },
})

const getNormalizedEmail = (email) => email?.trim().toLowerCase()

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required.',
      })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Server authentication is not configured.',
      })
    }

    const normalizedEmail = getNormalizedEmail(email)
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    })

    return res
      .status(201)
      .json(getAuthResponse(user, 'Account created successfully.'))
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    console.error('User registration failed:', {
      name: error?.name,
      code: error?.code,
    })

    return res.status(500).json({ message: 'Unable to create the account.' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      })
    }

    const user = await User.findOne({ email: getNormalizedEmail(email) }).select(
      '+password',
    )

    if (!user || !user.password || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      })
    }

    return res.status(200).json(getAuthResponse(user, 'Login successful.'))
  } catch (error) {
    console.error('User login failed:', { name: error?.name, code: error?.code })

    return res.status(500).json({ message: 'Unable to log in.' })
  }
}

export const requestPasswordReset = async (req, res) => {
  const genericResponse = {
    message: 'If an account exists for that email, a reset code has been sent.',
  }

  try {
    const normalizedEmail = getNormalizedEmail(req.body.email)

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const user = await User.findOne({ email: normalizedEmail }).select('_id')

    if (!user) {
      return res.status(200).json(genericResponse)
    }

    const otp = crypto.randomInt(100000, 1000000).toString()

    await PasswordReset.deleteMany({ email: normalizedEmail })
    await PasswordReset.create({
      email: normalizedEmail,
      otpHash: hashValue(otp),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    })

    try {
      await sendPasswordResetOtp({ to: normalizedEmail, otp })
    } catch (error) {
      await PasswordReset.deleteMany({ email: normalizedEmail })
      console.error('Password reset email failed:', {
        name: error?.name,
        code: error?.code,
        message: error?.message,
      })

      return res.status(500).json({
        message: 'Password recovery email is temporarily unavailable.',
      })
    }

    return res.status(200).json(genericResponse)
  } catch (error) {
    console.error('Password reset request failed:', {
      name: error?.name,
      code: error?.code,
    })

    return res.status(500).json({
      message: 'Unable to start password recovery. Please try again.',
    })
  }
}

export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const normalizedEmail = getNormalizedEmail(req.body.email)
    const otp = req.body.otp?.trim()

    if (!normalizedEmail || !otp) {
      return res
        .status(400)
        .json({ message: 'Email and reset code are required.' })
    }

    const passwordReset = await PasswordReset.findOne({
      email: normalizedEmail,
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 })

    if (!passwordReset || passwordReset.attempts >= MAX_OTP_ATTEMPTS) {
      return res
        .status(400)
        .json({ message: 'The reset code is invalid or expired.' })
    }

    const providedHash = hashValue(otp)
    const isValidOtp = crypto.timingSafeEqual(
      Buffer.from(passwordReset.otpHash),
      Buffer.from(providedHash),
    )

    if (!isValidOtp) {
      passwordReset.attempts += 1
      await passwordReset.save()

      return res
        .status(400)
        .json({ message: 'The reset code is invalid or expired.' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    passwordReset.resetTokenHash = hashValue(resetToken)
    passwordReset.verifiedAt = new Date()
    passwordReset.otpHash = undefined
    passwordReset.expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS)
    await passwordReset.save()

    return res.status(200).json({
      message: 'Code verified. You can now choose a new password.',
      resetToken,
    })
  } catch (error) {
    console.error('Password reset verification failed:', {
      name: error?.name,
      code: error?.code,
    })

    return res.status(500).json({ message: 'Unable to verify the reset code.' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const normalizedEmail = getNormalizedEmail(req.body.email)
    const { password, resetToken } = req.body

    if (!normalizedEmail || !password || !resetToken) {
      return res
        .status(400)
        .json({ message: 'Password reset details are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long.',
      })
    }

    const passwordReset = await PasswordReset.findOne({
      email: normalizedEmail,
      resetTokenHash: hashValue(resetToken),
      verifiedAt: { $exists: true },
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    })

    if (!passwordReset) {
      return res.status(400).json({
        message: 'This password reset session is invalid or expired.',
      })
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password')

    if (!user) {
      return res.status(400).json({
        message: 'This password reset session is invalid or expired.',
      })
    }

    user.password = password
    user.tokenVersion += 1
    await user.save()

    passwordReset.usedAt = new Date()
    await passwordReset.save()
    await PasswordReset.deleteMany({
      email: normalizedEmail,
      _id: { $ne: passwordReset._id },
    })

    return res.status(200).json({
      message: 'Password reset successfully. Please sign in.',
    })
  } catch (error) {
    console.error('Password reset failed:', {
      name: error?.name,
      code: error?.code,
    })

    return res.status(500).json({ message: 'Unable to reset your password.' })
  }
}

export const googleLogin = async (req, res) => {
  try {
    const credential = req.body.credential

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required.' })
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        message: 'Google sign-in is not configured.',
      })
    }

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const profile = ticket.getPayload()

    if (!profile?.sub || !profile.email || !profile.email_verified) {
      return res.status(401).json({
        message: 'Google did not provide a verified email address.',
      })
    }

    const email = getNormalizedEmail(profile.email)
    let user = await User.findOne({ googleId: profile.sub })

    if (!user) {
      user = await User.findOne({ email })

      if (user?.googleId && user.googleId !== profile.sub) {
        return res.status(409).json({
          message: 'This email is already linked to another Google account.',
        })
      }

      if (user) {
        user.googleId = profile.sub
        await user.save()
      } else {
        user = await User.create({
          name: profile.name?.trim() || email.split('@')[0],
          email,
          googleId: profile.sub,
        })
      }
    }

    return res
      .status(200)
      .json(getAuthResponse(user, 'Google sign-in successful.'))
  } catch (error) {
    console.error('Google sign-in failed:', {
      name: error?.name,
      code: error?.code,
    })

    return res.status(401).json({
      message: 'Google sign-in could not be verified.',
    })
  }
}
