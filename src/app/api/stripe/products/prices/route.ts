import { products, stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { id } = await request.json()

  const product = products.find((product) => product.id === id)

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 })
  }

  try {
    const stripePrice = await stripe.prices.list({
      product: product.id,
    })

    const extracted = {
      id: stripePrice.data[0].id,
      type: stripePrice.data[0].type,
    }

    return NextResponse.json(
      { message: 'success', data: extracted },
      { status: 200 },
    )
  } catch (error: any) {
    if (error.raw.code === 'resource_missing') {
      const stripePrice = await stripe.prices.create({
        product_data: {
          id: product.id,
          name: product.name,
        },
        currency: product.currency,
        unit_amount: product.amount * 100,
        recurring: product.recurring,
      })

      const extracted = {
        id: stripePrice.id,
        type: stripePrice.type,
      }

      return NextResponse.json(
        { message: 'success', data: extracted },
        { status: 201 },
      )
    }
  }

  return NextResponse.json({ message: 'success' })
}
