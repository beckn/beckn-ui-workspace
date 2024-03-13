import React, { useEffect } from 'react'
import LandingPage from './landingPage'

const Home = () => {
    useEffect(() => {
        if (localStorage) {
            localStorage.clear()
        }
    }, [])

    return (
        <div>
            <LandingPage />
        </div>
    )
}

export default Home
