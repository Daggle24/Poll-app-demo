import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendOtpEmail (to: string, code: string) {
  if (resend) {
    await resend.emails.send({
      from: 'Poll App <onboarding@resend.dev>',
      to: [to],
      subject: 'Your verification code',
      text: `Your code is: ${code}. It expires in 10 minutes.`
    })
  } else {
    console.log('[dev] OTP email (no RESEND_API_KEY):', { to, code })
  }
}
