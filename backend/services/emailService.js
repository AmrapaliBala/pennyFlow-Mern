import nodemailer from 'nodemailer'

const requiredEmailSettings = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM',
]

const getEmailTransporter = () => {
  const missingSetting = requiredEmailSettings.find(
    (setting) => !process.env[setting]?.trim(),
  )

  if (missingSetting) {
    throw new Error('Email delivery is not configured.')
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST.trim(),
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE?.trim() === 'true',
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_PASSWORD.trim(),
    },
  })
}

export const sendPasswordResetOtp = async ({ to, otp }) => {
  const transporter = getEmailTransporter()

  await transporter.sendMail({
    from: process.env.EMAIL_FROM.trim(),
    to,
    subject: 'Your PennyFlow password reset code',
    text: `Your PennyFlow password reset code is ${otp}. It expires in 10 minutes.`,
  })
}
