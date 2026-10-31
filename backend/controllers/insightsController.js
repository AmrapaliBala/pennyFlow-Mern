import { createFinancialInsight } from '../services/insightsService.js'

export const getFinancialInsight = async (req, res) => {
  try {
    const question = req.body.question?.trim()

    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication is required.' })
    }

    if (!question) {
      return res.status(400).json({ message: 'Ask a financial question.' })
    }

    if (question.length > 500) {
      return res.status(400).json({
        message: 'Questions must be 500 characters or fewer.',
      })
    }

    const result = await createFinancialInsight({
      userId: req.user._id,
      question,
    })

    return res.status(200).json({ answer: result.answer })
  } catch (error) {
    if (error?.code === 'GEMINI_NOT_CONFIGURED') {
      return res.status(503).json({
        message: 'Free AI insights are not configured on the server yet.',
      })
    }

    if (error?.status === 429 || error?.code === 429 || error?.code === 'RESOURCE_EXHAUSTED') {
      return res.status(503).json({
        message: 'AI insights are temporarily unavailable due to usage limits.',
      })
    }

    if (
      error?.name === 'AbortError' ||
      error?.name === 'TimeoutError' ||
      error?.code === 'ETIMEDOUT'
    ) {
      return res.status(504).json({
        message: 'The insights request timed out. Please try again.',
      })
    }

    console.error('Financial insight request failed:', {
      name: error?.name,
      code: error?.code,
      status: error?.status,
    })

    return res.status(502).json({
      message: 'Unable to generate financial insights right now.',
    })
  }
}
