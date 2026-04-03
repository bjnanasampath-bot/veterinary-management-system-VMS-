import { GoogleLogin } from '@react-oauth/google'
import { useDispatch } from 'react-redux'
import { googleLogin } from '../authSlice'

export default function GoogleAuthButton({ onSuccess, text }) {
  const dispatch = useDispatch()

  const handleSuccess = async (response) => {
    const result = await dispatch(googleLogin(response.credential))
    if (onSuccess) onSuccess(result.payload)
  }

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Login Failed')}
        useOneTap
        theme="outline"
        shape="pill"
        size="large"
        width="100%"
        text={text || 'signin_with'}
      />
    </div>
  )
}
