import axios from 'axios'
import React from 'react'
import SignIn from '../components/signIn/SignIn'

const Home = () => {
  const googleSignIn = () => {
    axios
      .get('https://strapi-bap.becknprotocol.io/api/connect/google')
      .then(res => console.log(res))
      .catch(e => console.error(e))
  }
  return (
    <div>
      <SignIn buttonClickHandler={() => googleSignIn()} />
    </div>
  )
}

export default Home
