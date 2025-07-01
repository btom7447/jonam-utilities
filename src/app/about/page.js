import BrandsSection from '@/components/BrandsSection';
import FeedbackSection from '@/components/FeedbackSection';
import MetricsSection from '@/components/MetricsSection';
import RequestQuoteBanner from '@/components/RequestQuoteBanner';
import SupportCareSection from '@/components/SupportCareSection';
import VideoSection from '@/components/VideoSection';
import React from 'react'

const About = () => {
  return (
    <>
      <SupportCareSection />
      <RequestQuoteBanner />
      <VideoSection />
      <MetricsSection />
      <BrandsSection />
      <FeedbackSection />
    </>
  )
}

export default About;

