import BrandsSection from '@/components/BrandsSection'
import CategorySection from '@/components/CategorySection'
import MetricsSection from '@/components/MetricsSection'
import QuotePoster from '@/components/QuotePoster'
import ServicesPoster from '@/components/ServicesPoster'
import React from 'react'

const ServicesPage = () => {
    return (
        <>
            {/* <CategorySection /> */}
            <ServicesPoster />
            <QuotePoster />
            <MetricsSection />
            <BrandsSection />
        </>
    )
}

export default ServicesPage