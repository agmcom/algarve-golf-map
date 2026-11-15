// Tag outbound links so the receiving site can see the visit came from us.
// Format agreed with the user: utm_source=algarvegolfmap.com (with dots).
// Never use on affiliate links (Booking, Golfscape, GetTransfer, EconomyBookings): they carry their own tracking.
export function withUtm(url: string): string {
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', 'algarvegolfmap.com')
    return u.toString()
  } catch {
    return url
  }
}
