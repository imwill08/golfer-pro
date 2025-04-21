import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const TermsOfService = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using GolfPro Connect, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              GolfPro Connect is a platform that connects golf instructors with students seeking to improve their golf game. We provide the following services:
            </p>
            <ul className="list-disc pl-6">
              <li>Instructor profiles and listings</li>
              <li>Booking and scheduling system</li>
              <li>Communication tools</li>
              <li>Review and rating system</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <p>
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any security breaches</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Instructor Terms</h2>
            <div className="space-y-4">
              <p>For instructors using our platform:</p>
              <ul className="list-disc pl-6">
                <li>Must maintain accurate profile information</li>
                <li>Responsible for setting their own rates and availability</li>
                <li>Must honor scheduled appointments</li>
                <li>Required to maintain professional conduct</li>
                <li>Subject to our review and rating system</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Student Terms</h2>
            <div className="space-y-4">
              <p>For students using our platform:</p>
              <ul className="list-disc pl-6">
                <li>Must provide accurate booking information</li>
                <li>Required to follow cancellation policies</li>
                <li>Responsible for showing up to scheduled lessons</li>
                <li>Expected to maintain respectful communication</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payments and Refunds</h2>
            <div className="space-y-4">
              <p>
                All payments are processed through our secure payment system. Refunds are subject to:
              </p>
              <ul className="list-disc pl-6">
                <li>Individual instructor cancellation policies</li>
                <li>Platform service fees are non-refundable</li>
                <li>Disputes must be submitted within 48 hours</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>
              All content on GolfPro Connect, including text, graphics, logos, and software, is the property of GolfPro Connect and protected by intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              GolfPro Connect is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Users will be notified of any changes through the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4">
              <p>Email: legal@golfproconnect.com</p>
              <p>Address: 123 Golf Avenue, Suite 456, Orlando, FL 32801</p>
            </div>
          </section>

          <section>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfService; 