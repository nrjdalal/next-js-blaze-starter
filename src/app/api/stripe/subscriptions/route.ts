import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.redirect('/access')
  }

  const stripeCustomer = await stripe.customers.list({
    email: session.user.email,
  })

  const stripeSubscription = await stripe.subscriptions.list({
    customer: stripeCustomer.data[0].id,
  })

  return NextResponse.json({
    message: 'success',
    data: stripeSubscription.data[0],
  })
}
