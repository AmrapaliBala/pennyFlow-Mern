import mongoose from 'mongoose'

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    otpHash: {
      type: String,
    },
    resetTokenHash: String,
    attempts: {
      type: Number,
      default: 0,
    },
    verifiedAt: Date,
    usedAt: Date,
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  },
)

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)

export default PasswordReset
