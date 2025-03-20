'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from '@/lib/api-client'

enum LoginState {
  LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
}

export default function HomePage() {
  const [loginState, setLoginState] = useState<LoginState>(LoginState.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await apiClient.login({ email, password });
      apiClient.setAuthToken(response.token);
      router.push('/draft');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during login');
      }
    }
  }

  const handleForgotPassword = () => {
    // Placeholder forgot password logic
    console.log('Forgot password for passphrase:', passphrase)
    setLoginState(LoginState.RESET_PASSWORD)
  }

  const handleResetPassword = () => {
    // Placeholder reset password logic
    if (newPassword === confirmPassword) {
      console.log('Password reset successfully')
      setLoginState(LoginState.LOGIN)
    } else {
      setError('Passwords do not match')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Email Platform</h1>

        {loginState === LoginState.LOGIN && (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleLogin}>Login</Button>
            <div className="text-center mt-4">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setLoginState(LoginState.FORGOT_PASSWORD)}
              >
                Forgot Password?
              </button>
            </div>
          </>
        )}

        {loginState === LoginState.FORGOT_PASSWORD && (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="passphrase">Passphrase</Label>
                <Input
                  id="passphrase"
                  type="text"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleForgotPassword}>Submit</Button>
          </>
        )}

        {loginState === LoginState.RESET_PASSWORD && (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleResetPassword}>Reset Password</Button>
          </>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-center">{error}</div>
        )}
      </div>
    </div>
  )
}

