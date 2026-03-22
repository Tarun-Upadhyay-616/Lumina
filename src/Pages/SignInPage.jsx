import {SignIn} from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-950 p-4'>
      <div className="w-full max-w-md">
        <SignIn signUpUrl="/auth/signup" routing="path" path="/auth/signin"/>
      </div>
    </div>
  )
}