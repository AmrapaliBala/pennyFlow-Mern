import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication token is required.',
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT authentication is not configured.')

      return res.status(500).json({
        message: 'Authentication is temporarily unavailable.',
      })
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select('_id tokenVersion')

    if (!user || decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        message: 'Authentication token is no longer valid.',
      })
    }

    req.user = {
      _id: user._id,
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Authentication token has expired. Please log in again.',
      })
    }

    return res.status(401).json({
      message: 'Authentication token is invalid.',
    })
  }
}
