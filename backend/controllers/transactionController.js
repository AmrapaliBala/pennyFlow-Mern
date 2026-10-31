import Transaction from '../models/Transaction.js'

export const getTransactions = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        message: 'Authentication is required.',
      })
    }

    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 })

    return res.status(200).json(transactions)
  } catch {
    console.error('Could not retrieve transactions.')

    return res.status(500).json({
      message: 'Unable to retrieve transactions.',
    })
  }
}

export const createTransaction = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        message: 'Authentication is required.',
      })
    }

    const { description, amount } = req.body
    const numericAmount = Number(amount)

    if (
      !description?.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount === 0
    ) {
      return res.status(400).json({
        message: 'Provide a description and a non-zero amount.',
      })
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      description: description.trim(),
      amount: numericAmount,
    })

    return res.status(201).json(transaction)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message,
      })
    }

    console.error('Could not create transaction.')

    return res.status(500).json({
      message: 'Unable to create transaction.',
    })
  }
}

export const deleteTransaction = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        message: 'Authentication is required.',
      })
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found.',
      })
    }

    return res.status(200).json({
      message: 'Transaction deleted successfully.',
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid transaction ID.',
      })
    }

    console.error('Could not delete transaction.')

    return res.status(500).json({
      message: 'Unable to delete transaction.',
    })
  }
}

export const getDashboardSummary = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        message: 'Authentication is required.',
      })
    }

    const transactions = await Transaction.find({
      user: req.user._id,
    }).select('amount')

    const summary = transactions.reduce(
      (totals, transaction) => {
        if (transaction.amount > 0) {
          totals.income += transaction.amount
        } else {
          totals.expense += Math.abs(transaction.amount)
        }

        totals.balance = totals.income - totals.expense

        return totals
      },
      {
        income: 0,
        expense: 0,
        balance: 0,
      },
    )

    return res.status(200).json(summary)
  } catch {
    console.error('Could not retrieve dashboard summary.')

    return res.status(500).json({
      message: 'Unable to retrieve dashboard summary.',
    })
  }
}