import React from 'react'

const companies = [
  { name: 'Netflix', logo: (
    <span className='text-2xl font-bold tracking-tight' style={{color:'#E50914'}}>NETFLIX</span>
  )},
  { name: 'Google', logo: (
    <span className='text-2xl font-semibold'>
      <span style={{color:'#4285F4'}}>G</span>
      <span style={{color:'#EA4335'}}>o</span>
      <span style={{color:'#FBBC05'}}>o</span>
      <span style={{color:'#4285F4'}}>g</span>
      <span style={{color:'#34A853'}}>l</span>
      <span style={{color:'#EA4335'}}>e</span>
    </span>
  )},
  { name: 'LinkedIn', logo: (
    <span className='text-2xl font-bold' style={{color:'#0A66C2'}}>Linked<span className='bg-[#0A66C2] text-white px-1 rounded'>in</span></span>
  )},
  { name: 'Instagram', logo: (
    <span className='text-2xl font-semibold text-gray-800'>Instagram</span>
  )},
  { name: 'Facebook', logo: (
    <span className='text-2xl font-bold' style={{color:'#1877F2'}}>facebook</span>
  )},
  { name: 'Slack', logo: (
    <span className='text-2xl font-bold text-gray-800'>
      <span style={{color:'#E01E5A'}}>✦</span> slack
    </span>
  )},
  { name: 'Framer', logo: (
    <span className='text-2xl font-semibold text-gray-800'>⬡ Framer</span>
  )},
]

const Companies = () => {
  return (
    <div className='overflow-hidden py-10 bg-gradient-to-b from-rose-50/60 to-transparent max-w-5xl mx-auto'>
      <div className='relative flex'>
        {/* Fade edges */}
        <div className='absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10'></div>
        <div className='absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10'></div>

        {/* Scrolling track — duplicated for seamless loop */}
        <div className='flex items-center gap-16 animate-marquee whitespace-nowrap'>
          {companies.map((c, i) => (
            <div key={i} className='flex items-center opacity-70 hover:opacity-100 transition-opacity duration-300'>
              {c.logo}
            </div>
          ))}
          {companies.map((c, i) => (
            <div key={`dup-${i}`} className='flex items-center opacity-70 hover:opacity-100 transition-opacity duration-300'>
              {c.logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Companies
