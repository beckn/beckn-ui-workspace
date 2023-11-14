import React from 'react'
import { Button } from '@beckn-ui/molecules'

export default function Login() {
  return (
    <div>
      <Button text="Login" />
      <Button
        variant="outline"
        text="Login"
      />
      <Button
        disabled={true}
        text="Login"
      />
      <Button
        fullWidth={false}
        text="Login"
      />
      <Button
        disabled={true}
        variant="outline"
        text="Login"
      />
    </div>
  )
}
