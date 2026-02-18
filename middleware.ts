import { auth } from '@/auth.config'

export default auth((req) => {
  // authorized callback in auth.config handles redirect
})

export const config = {
  matcher: ['/admin/dashboard/:path*']
}
