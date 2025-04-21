import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const FAQs = () => {
  const faqs = [
    {
      question: "How do I find a golf instructor?",
      answer: "You can easily find a golf instructor by using our search feature. Simply enter your location and preferences (like lesson type, price range, or specific skills you want to improve) and browse through our qualified instructors."
    },
    {
      question: "How do I become an instructor on GolfPro Connect?",
      answer: "To become an instructor, click on 'Join as Instructor' in the navigation menu. Fill out the application form with your professional details, certifications, and teaching experience. Our team will review your application and get back to you within 1-2 business days."
    },
    {
      question: "What types of lessons are available?",
      answer: "Our instructors offer various lesson types including private one-on-one lessons, group lessons, online coaching sessions, and on-course instruction. Each instructor sets their own availability and lesson formats."
    },
    {
      question: "Are all instructors certified?",
      answer: "While not all instructors are required to have specific certifications, many of our instructors hold certifications from organizations like PGA, LPGA, and TPI. You can filter instructors by certification type in the search results."
    },
    {
      question: "How do I know which instructor is right for me?",
      answer: "Each instructor has a detailed profile showing their teaching philosophy, experience, specialties, and student reviews. You can also filter instructors based on your specific needs (e.g., beginner-friendly, short game specialists, etc.)."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Cancellation policies may vary by instructor. Each instructor sets their own cancellation policy, which will be clearly displayed when you book a lesson. Generally, we recommend giving at least 24 hours notice for any cancellations."
    },
    {
      question: "How do I contact an instructor?",
      answer: "You can contact instructors directly through their profile page. Each instructor has a contact button that will allow you to send them a message or inquiry about lessons."
    },
    {
      question: "Are there group lesson options available?",
      answer: "Yes, many instructors offer group lessons. You can filter for instructors who offer group lessons in the search results, and check their profiles for specific group lesson details and pricing."
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="mb-6">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQs; 