import { db, users } from '@/lib/database'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const event = await request.json()

  console.log(`Received event: ${event.id} - ${event.type}`)

  // TODO: Validate the event

  const session = event.data.object as Stripe.Checkout.Session

  try {
    switch (event.type) {
      case 'charge.updated': {
        const charge = await stripe.charges.retrieve(session.id)

        if (charge.status === 'succeeded') {
          let getCredits =
            (
              await db
                .select({
                  credits: users.credits,
                })
                .from(users)
                .where(eq(users.stripeCustomerId, charge.customer as string))
            )[0].credits || 0

          await db
            .update(users)
            .set({
              credits:
                getCredits +
                (charge.amount / 100 === 5
                  ? (1000 * 110) / 100
                  : charge.amount / 100 === 10
                    ? (2000 * 120) / 100
                    : charge.amount / 100 === 15
                      ? (3000 * 130) / 100
                      : 0),
            })
            .where(eq(users.stripeCustomerId, charge.customer as string))
        }

        break
      }
      case 'invoice.payment_succeeded': {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        )

        await db
          .update(users)
          .set({
            stripePlan: subscription.items.data[0].price.product as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeSubscriptionId: subscription.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          })
          .where(eq(users.stripeCustomerId, subscription.customer as string))

        break
      }
      default: {
        console.log(`Unhandled event type: ${event.type}`)
      }
    }
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ message: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  return new Response(JSON.stringify({ event }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

// {
//   id: 'ch_3PP4t1JH5MdvGAXK1LKNZTw8',
//   object: 'charge',
//   amount: 500,
//   amount_captured: 500,
//   amount_refunded: 0,
//   application: null,
//   application_fee: null,
//   application_fee_amount: null,
//   balance_transaction: 'txn_3PP4t1JH5MdvGAXK1fQl9NC4',
//   billing_details: {
//     address: {
//       city: null,
//       country: 'IN',
//       line1: null,
//       line2: null,
//       postal_code: null,
//       state: null
//     },
//     email: 'nd941z@gmail.com',
//     name: 'Neeraj Dalal',
//     phone: null
//   },
//   calculated_statement_descriptor: 'Stripe',
//   captured: true,
//   created: 1717774767,
//   currency: 'usd',
//   customer: 'cus_QFa3n2F1PqpWeq',
//   description: 'Subscription creation',
//   destination: null,
//   dispute: null,
//   disputed: false,
//   failure_balance_transaction: null,
//   failure_code: null,
//   failure_message: null,
//   fraud_details: {},
//   invoice: 'in_1PP4t0JH5MdvGAXKpxGqsOyo',
//   livemode: false,
//   metadata: {},
//   on_behalf_of: null,
//   order: null,
//   outcome: {
//     network_status: 'approved_by_network',
//     reason: null,
//     risk_level: 'normal',
//     risk_score: 43,
//     seller_message: 'Payment complete.',
//     type: 'authorized'
//   },
//   paid: true,
//   payment_intent: 'pi_3PP4t1JH5MdvGAXK1HUDgKTF',
//   payment_method: 'pm_1PP4szJH5MdvGAXKjguhOHQo',
//   payment_method_details: {
//     card: {
//       amount_authorized: 500,
//       brand: 'visa',
//       checks: {
//         address_line1_check: null,
//         address_postal_code_check: null,
//         cvc_check: 'pass'
//       },
//       country: 'US',
//       exp_month: 12,
//       exp_year: 2034,
//       extended_authorization: { status: 'disabled' },
//       fingerprint: '0aeOnE8Lw2QvEKeE',
//       funding: 'credit',
//       incremental_authorization: { status: 'unavailable' },
//       installments: null,
//       last4: '4242',
//       mandate: null,
//       multicapture: { status: 'unavailable' },
//       network: 'visa',
//       network_token: { used: false },
//       overcapture: { maximum_amount_capturable: 500, status: 'unavailable' },
//       three_d_secure: null,
//       wallet: { dynamic_last4: null, link: {}, type: 'link' }
//     },
//     type: 'card'
//   },
//   radar_options: {},
//   receipt_email: null,
//   receipt_number: null,
//   receipt_url:
//     'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xUE9MY1lKSDVNZHZHQVhLKLHTjLMGMgbhzZa0bSY6LBbvLJQLKPbRfyCkOBb5Or13Fn6z-Xa4ePwyziUEeEUoXYqlBae3VMTxbSAD?s=ap',
//   refunded: false,
//   review: null,
//   shipping: null,
//   source: null,
//   source_transfer: null,
//   statement_descriptor: null,
//   statement_descriptor_suffix: null,
//   status: 'succeeded',
//   transfer_data: null,
//   transfer_group: null
// }
