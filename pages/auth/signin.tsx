import { signIn, getSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import Head from "next/head"

export default function SignIn() {
  const router = useRouter()

  const handleGoogleSignIn = () => {
    console.log('Attempting Google sign in...')
    signIn("google", { callbackUrl: "/" })
      .catch((error) => {
        console.error('Sign in error:', error)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCF9F2' }}>
      <Head>
        <title>Sign In - Prime Factor Trees</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-wider mb-2" style={{ color: '#4A6FA5', fontFamily: 'Georgia, serif' }}>
            Prime Factor Trees
          </h1>
          <p className="text-gray-600 mb-8">Sign in to track your progress</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Continue without signing in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  
  return {
    props: {},
  }
} 