import React from 'react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';

const Support = () => {
  const supportTopics = [
    {
      title: "Account Issues",
      description: "Help with login, registration, and account settings",
      link: "/faqs#account"
    },
    {
      title: "Booking Problems",
      description: "Assistance with lesson scheduling and cancellations",
      link: "/faqs#booking"
    },
    {
      title: "Payment Questions",
      description: "Information about payments, refunds, and billing",
      link: "/faqs#payments"
    },
    {
      title: "Instructor Support",
      description: "Help for instructors using the platform",
      link: "/faqs#instructors"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Support Center</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you with any questions or issues you may have. Check out our common support topics below or contact us directly.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Email Support</h3>
                <p className="text-muted-foreground">support@golfproconnect.com</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Phone Support</h3>
                <p className="text-muted-foreground">1-800-GOLF-PRO (1-800-465-3776)</p>
                <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  required
                />
              </div>
              <div>
                <label htmlFor="issue" className="block text-sm font-medium mb-2">
                  Issue Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="booking">Booking Problems</SelectItem>
                    <SelectItem value="payment">Payment Questions</SelectItem>
                    <SelectItem value="instructor">Instructor Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Support Request
              </Button>
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Common Support Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTopics.map((topic, index) => (
              <Link
                key={index}
                to={topic.link}
                className="block p-6 bg-card rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-medium mb-2">{topic.title}</h3>
                <p className="text-muted-foreground">{topic.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Check our comprehensive FAQ section for more detailed information about using GolfPro Connect.
          </p>
          <Button asChild variant="outline">
            <Link to="/faqs">Visit FAQ Page</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Support; 