
import { InstructorFormValues } from '@/types/instructor';

export const processInstructorSpecializations = (data: InstructorFormValues) => {
  const certifications = [];
  if (data.certifications.pga) certifications.push('PGA');
  if (data.certifications.lpga) certifications.push('LPGA');
  if (data.certifications.tpi) certifications.push('TPI');
  if (data.certifications.other && data.certifications.otherText) {
    certifications.push(data.certifications.otherText);
  }
  
  const specialties = [];
  if (data.specialties.shortGame) specialties.push('Short Game');
  if (data.specialties.putting) specialties.push('Putting');
  if (data.specialties.driving) specialties.push('Driving');
  if (data.specialties.courseStrategy) specialties.push('Course Strategy');
  if (data.specialties.mentalApproach) specialties.push('Mental Approach');
  if (data.specialties.beginnerLessons) specialties.push('Beginner Lessons');
  if (data.specialties.advancedTraining) specialties.push('Advanced Training');
  if (data.specialties.juniorCoaching) specialties.push('Junior Coaching');
  
  return { certifications, specialties };
};

