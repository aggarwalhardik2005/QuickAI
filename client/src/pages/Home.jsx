import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Companies from '../components/Companies'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
        <Navbar />
        <Hero />
        <Companies />
        <AiTools />
        <Testimonial />
        <Plan/>
        <Footer />
    </>
  )
}

export default Home