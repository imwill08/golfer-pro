import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function JoinInstructorSuccess() {
  return (
    <div className="container max-w-2xl py-12">
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-green-600">Application Submitted Successfully!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for applying to join Golf Pro Finder as an instructor.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What happens next?</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>Your application is now pending review by our admin team</li>
            <li>You will receive an email notification once your application is reviewed</li>
            <li>The review process typically takes 1-2 business days</li>
            <li>Once approved, your profile will be visible to students on our platform</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">While you wait</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>Prepare any additional teaching materials or resources</li>
            <li>Review our instructor guidelines and best practices</li>
            <li>Set up your calendar for lesson availability</li>
          </ul>
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/" passHref>
            <Button size="lg">
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
} 