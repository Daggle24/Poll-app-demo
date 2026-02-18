import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { consumeToken } from '@/lib/auth-token-store'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        token: { label: 'Token', type: 'text' }
      },
      async authorize (credentials) {
        const token = credentials?.token as string | undefined
        if (!token) return null
        const admin = consumeToken(token)
        if (!admin) return null
        return {
          id: admin.adminId,
          email: admin.email,
          name: admin.name
        }
      }
    })
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    authorized ({ auth, request }) {
      const isDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard')
      if (isDashboard) return !!auth
      return true
    },
    jwt ({ token, user }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session ({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.email = token.email ?? ''
        session.user.name = (token.name as string) ?? ''
      }
      return session
    }
  }
})
