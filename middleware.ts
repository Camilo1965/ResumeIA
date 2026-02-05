import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rutas públicas
        const publicPaths = ['/login', '/register', '/share']
        const isPublicPath = publicPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        )
        
        if (isPublicPath) return true
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
