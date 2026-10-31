import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A transaction must belong to a user.'],
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
      maxlength: [100, 'Description cannot exceed 100 characters.'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required.'],
      validate: {
        validator: (value) => value !== 0,
        message: 'Amount cannot be zero.',
      },
    },
  },
  {
    timestamps: true,
  },
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction