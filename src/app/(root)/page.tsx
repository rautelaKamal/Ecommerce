import React from 'react'
import Card from '@/components/Card'

const Home = () => {
    return(
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-[var(--text-heading-2)] leading-[var(--text-heading-2--line-height)] font-bold" style={{ color: 'var(--color-dark-900)' }}>Featured</h1>
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              title="Nike Air Force 1"
              description="Classic comfort with a timeless look."
              imageSrc="/shoes/shoe-1.jpg"
              price={120}
              badge={{ label: 'Best Seller' }}
              href="#"
            />
            <Card
              title="Jordan Pro"
              description="High performance cushioning for courts and streets."
              imageSrc="/shoes/shoe-3.webp"
              price={150}
              href="#"
            />
            <Card
              title="Pegasus Runner"
              description="Everyday responsive running comfort."
              imageSrc="/shoes/shoe-6.avif"
              price={130}
              href="#"
            />
          </section>
        </main>  
    )
  }
  export default Home;

