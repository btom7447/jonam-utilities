import BrandsSection from '@/components/BrandsSection'
import FeedbackSection from '@/components/FeedbackSection'
import MetricsSection from '@/components/MetricsSection'
import RequestQuoteBanner from '@/components/RequestQuoteBanner'
import ServicesBanner from '@/components/ServicesBanner'
import ServicesPoster from '@/components/ServicesPoster'
import React from 'react'

const ServicesPage = () => {
    return (
        <>
            <ServicesBanner />
            {/* <CategorySection /> */}
            <ServicesPoster />
            <RequestQuoteBanner />
            {/* <MetricsSection /> */}
            <FeedbackSection />
            <BrandsSection />
        </>
    )
}

export default ServicesPage