import { auth } from '@/lib/auth'
import { db, users } from '@/lib/database'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { priceId, type } = await request.json()

  const session = await auth()

  if (!session) {
    return NextResponse.redirect('/access')
  }

  let customerId = (
    await db
      .select({
        stripeCustomerId: users.stripeCustomerId,
      })
      .from(users)
      .where(eq(users.publicId, session.user.publicId))
  )[0].stripeCustomerId

  let stripeCustomer = (
    await stripe.customers.list({
      email: session.user.email,
    })
  ).data[0]

  if (!customerId || customerId !== stripeCustomer?.id) {
    if (!stripeCustomer) {
      stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          ...session.user,
        },
      })
    }

    customerId = stripeCustomer.id

    await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
      })
      .where(eq(users.publicId, session.user.publicId))
  }

  const stripeSession = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: type === 'recurring' ? 'subscription' : 'payment',
    return_url: `${request.headers.get('origin')}/billing?session_id={CHECKOUT_SESSION_ID}`,
    ui_mode: 'embedded',
  })

  const extracted = {
    client_secret: stripeSession.client_secret,
  }

  return NextResponse.json({
    message: 'success',
    data: extracted,
  })
}
