import { auth } from '@/lib/auth'
import { db, users } from '@/lib/database'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.redirect('/access')
  }

  const plan = (
    await db
      .select({
        stripePlan: users.stripePlan,
        stripePriceId: users.stripePriceId,
        stripeSubscriptionId: users.stripeSubscriptionId,
        stripeCurrentPeriodEnd: users.stripeCurrentPeriodEnd,
      })
      .from(users)
      .where(eq(users.publicId, session.user.publicId))
  )[0]

  const extended = {
    ...session.user,
    ...plan,
  }

  return NextResponse.json(extended)
}
