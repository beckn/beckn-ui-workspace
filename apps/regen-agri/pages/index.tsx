import React, { useEffect } from 'react'
import HomePage from './homePage'

const Home = () => {
    useEffect(() => {
        if (localStorage) {
            localStorage.clear()
        }
    }, [])

    return (
        <div>
            <HomePage />
        </div>
    )
}

export default Home
