import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface Product {
  id: string // the id should be unique
  name: string // the names should be unique
  amount: number // the amount should be in dollars
  currency: string // the ISO currency code
  recurring?:
    | {
        interval: 'day' | 'week' | 'month' | 'year'
      }
    | undefined
  description?: string // the description of the product
}

export const products: Product[] = [
  // recurring Payments
  {
    id: 'pro_plan',
    name: 'Pro Plan',
    amount: 5,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
  },
  {
    id: 'premium_plan',
    name: 'Premium Plan',
    amount: 10,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
  },
  // one-time Payments
  {
    id: 'starter_pack',
    name: 'Starter Pack',
    amount: 5,
    currency: 'usd',
    description: '1000 credits + 100 bonus',
  },
  {
    id: 'pro_pack',
    name: 'Pro Pack',
    amount: 10,
    currency: 'usd',
    description: '2000 credits + 400 bonus',
  },
  {
    id: 'premium_pack',
    name: 'Premium Pack',
    amount: 15,
    currency: 'usd',
    description: '3000 credits + 900 bonus',
  },
]
