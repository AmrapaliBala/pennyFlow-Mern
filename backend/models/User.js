import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long.'],
      maxlength: [50, 'Name cannot exceed 50 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address.',
      },
    },
    password: {
      type: String,
      required: function passwordIsRequired() {
        return !this.googleId
      },
      minlength: [6, 'Password must be at least 6 characters long.'],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = async function comparePassword(
  enteredPassword,
) {
  return bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
