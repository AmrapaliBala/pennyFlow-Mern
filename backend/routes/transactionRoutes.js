import express from 'express'
import {
  createTransaction,
  deleteTransaction,
  getDashboardSummary,
  getTransactions,
} from '../controllers/transactionController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getTransactions)
router.post('/', protect, createTransaction)
router.get('/summary', protect, getDashboardSummary)
router.delete('/:id', protect, deleteTransaction)

export default router