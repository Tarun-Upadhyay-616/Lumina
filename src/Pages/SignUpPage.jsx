import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-950 p-4'>
      <div className="w-full max-w-md">
        <SignUp signInUrl="/auth/signin" routing="path" path="/auth/signup"/>
      </div>
    </div>
  )
}