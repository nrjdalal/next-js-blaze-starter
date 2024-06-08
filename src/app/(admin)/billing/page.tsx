'use client'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/stripe-dialog'
import { products } from '@/lib/stripe'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="container max-w-screen-2xl space-y-12">
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-2xl font-medium">Billing</h1>
        <p className="text-primary/50">
          Easily add credits and manage subscriptions
        </p>
      </div>

      <div className="space-y-5">
        <h2 className="font-medium text-primary/50">Available Plans</h2>
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {products
            .filter((product) => product.recurring)
            .map((plan, index) =>
              false ? (
                <div key={index} className="relative select-none">
                  <span className="absolute left-2 top-2 rounded-md bg-green-600 px-2 py-0.5 text-sm font-medium text-white">
                    Current
                  </span>
                  <div className="flex flex-col items-center space-y-1 rounded-md border border-green-500 bg-background p-5">
                    <h3 className="text-xl font-medium">{plan.name}</h3>
                    <p className="text-lg text-primary/75">
                      {plan.amount} {plan.currency.toUpperCase()} /{' '}
                      {plan.recurring?.interval}
                    </p>
                  </div>
                </div>
              ) : (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <button
                      key={index}
                      className="space-y-1 rounded-md border bg-background p-5"
                    >
                      <h3 className="text-xl font-medium">{plan.name}</h3>
                      <p className="text-lg text-primary/75">
                        {plan.amount} {plan.currency.toUpperCase()} /{' '}
                        {plan.recurring?.interval}
                      </p>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="overflow-hidden rounded-lg bg-white p-0 pb-5">
                    <StripeEmbed item={plan} />
                  </DialogContent>
                </Dialog>
              ),
            )}
        </div>
      </div>

      <div className="space-y-5">
        <h2 className="font-medium text-primary/50">Add Credits</h2>
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {products
            .filter((product) => !product.recurring)
            .map((item, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <button
                    key={index}
                    className="space-y-1 rounded-md border bg-background p-5"
                  >
                    <h3 className="text-xl font-medium">{item.name}</h3>
                    <p className="text-lg text-primary/75">
                      {item.amount} {item.currency.toUpperCase()}
                    </p>
                  </button>
                </DialogTrigger>
                <DialogContent className="overflow-hidden rounded-lg bg-white p-0 pb-5">
                  <StripeEmbed item={item} />
                </DialogContent>
              </Dialog>
            ))}
        </div>
      </div>
    </div>
  )
}

const StripeEmbed = ({ item }: { item: { id: string } }) => {
  return (
    <>
      {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!.startsWith(
        'pk_test',
      ) && (
        <div className="mt-5 flex flex-col items-center">
          <p className="text-xs font-medium text-black/75">
            This is a{' '}
            <Link
              className="underline"
              href="https://stripe.com/docs/testing#international-cards"
            >
              test mode payment
            </Link>
            . No charges will be made
          </p>
          <p className="mt-2 text-sm font-bold uppercase text-red-500">
            Example Test Card
          </p>
          <pre className="w mt-2 min-w-80 rounded-md border px-5 py-2 text-center font-bold text-black/75">
            4242 4242 4242 4242
            <br />
            <span className="text-black/30">Expiry</span> 12/34{' '}
            <span className="text-black/30">CVC</span> 123
          </pre>
        </div>
      )}
      <EmbeddedCheckoutProvider
        stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)}
        options={{
          fetchClientSecret: async () => {
            // validate the item
            const prices = await fetch('/api/stripe/products/prices', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: item.id }),
            }).then((res) => res.json())

            // create a checkout session
            const checkoutSessions = await fetch(
              '/api/stripe/checkout/sessions',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  priceId: prices.data.id,
                  type: prices.data.type,
                }),
              },
            ).then((res) => res.json())

            // return the client secret
            return checkoutSessions.data.client_secret
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </>
  )
}
