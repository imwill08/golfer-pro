import { InstructorFormValues } from '@/types/instructor';

export const processInstructorFaqs = (faqs: InstructorFormValues['faqs']) => {
  if (!faqs || !Array.isArray(faqs)) {
    return [];
  }

  return faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));
};

