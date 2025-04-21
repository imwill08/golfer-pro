
import { InstructorFormValues } from '@/types/instructor';

export const processInstructorServices = (data: InstructorFormValues) => {
  const services = {};
  
  if (data.lessonTypes.privateLesson && data.services.privateLesson) {
    services['privateLesson'] = {
      title: 'Private Lesson',
      description: data.services.privateLesson.description,
      duration: data.services.privateLesson.duration,
      price: data.services.privateLesson.price
    };
  }
  
  if (data.lessonTypes.groupLessons && data.services.groupLessons) {
    services['groupLessons'] = {
      title: 'Group Lessons',
      description: data.services.groupLessons.description,
      duration: data.services.groupLessons.duration,
      price: data.services.groupLessons.price
    };
  }
  
  if (data.lessonTypes.onlineCoaching && data.services.onlineCoaching) {
    services['onlineCoaching'] = {
      title: 'Online Coaching',
      description: data.services.onlineCoaching.description,
      duration: data.services.onlineCoaching.duration,
      price: data.services.onlineCoaching.price
    };
  }
  
  if (data.lessonTypes.oncourseInstruction && data.services.oncourseInstruction) {
    services['oncourseInstruction'] = {
      title: 'On-Course Instruction',
      description: data.services.oncourseInstruction.description,
      duration: data.services.oncourseInstruction.duration,
      price: data.services.oncourseInstruction.price
    };
  }
  
  if (data.lessonTypes.advancedTraining && data.services.advancedTraining) {
    services['advancedTraining'] = {
      title: 'Advanced Training',
      description: data.services.advancedTraining.description,
      duration: data.services.advancedTraining.duration,
      price: data.services.advancedTraining.price
    };
  }
  
  if (data.lessonTypes.juniorCoaching && data.services.juniorCoaching) {
    services['juniorCoaching'] = {
      title: 'Junior Coaching',
      description: data.services.juniorCoaching.description,
      duration: data.services.juniorCoaching.duration,
      price: data.services.juniorCoaching.price
    };
  }
  
  return services;
};

