# Hotel search and distribution readiness

The public hotel catalogue is request-based until Alfred receives an authorised
Little Emperors rate endpoint and property mapping. It must never display
private/member-only rates or advertise a public “lowest price” that cannot be
booked for the visible dates and occupancy.

## Already implemented

- Searchable city, date and guest controls with crawlable hotel detail pages.
- Public price markup appears only for supplier responses explicitly marked
  `publicRate: true`, `bookable: true` and `taxesIncluded: true`.
- Partner credentials stay in Vercel server-side variables.
- Missing or unavailable rates fall back to “Price on request”.

## Required before public rates go live

1. Written permission from Little Emperors for Alfred's intended website use.
2. An approved API or adapter endpoint and authentication method.
3. A mapping from each Alfred accommodation to its Little Emperors property ID.
4. Confirmation of which returned prices are public, bookable and fee-inclusive.
5. Booking, cancellation and customer-support responsibilities.
6. Production monitoring for price accuracy and partner endpoint failures.

## Environment variables

- `LITTLE_EMPERORS_RATES_ENDPOINT`
- `LITTLE_EMPERORS_API_KEY`

Both values are server-side only and must never use the `VITE_` prefix.
