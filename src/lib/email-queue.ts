// lib/emailQueue.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type SendJob = () => Promise<void>

class EmailQueue {
  private queue: SendJob[] = []
  private processing = false
  private delayMs = 500 // Adjust depending on Resend limits

  enqueue(job: SendJob) {
    this.queue.push(job)
    if (!this.processing) this.process()
  }

  private async process() {
    this.processing = true

    while (this.queue.length > 0) {
      const job = this.queue.shift()
      if (job) {
        try {
          await job()
        } catch (err) {
          console.error('❌ Email send failed:', err)
        }
        await new Promise((r) => setTimeout(r, this.delayMs))
      }
    }

    this.processing = false
  }
}

export const emailQueue = new EmailQueue()
export { resend }
