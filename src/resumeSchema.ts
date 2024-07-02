import { z } from 'zod';

const durationSchema = z.object({
  end: z.string().nullable().optional(),
  start: z.string()
});

export const resumeSchema = z.object({
  aboutMe: z.string(),
  citizenship: z.string(),
  city: z.string(),
  educationList: z.array(
    z.object({
      degreeOfEducation: z.string(),
      educationalInstitution: z.string(),
      educationDepartment: z.string(),
      educationDuration: durationSchema,
      educationFaculty: z.string()
    })
  ),
  email: z.string().email(),
  firstName: z.string(),
  fullName: z.string(),
  jobExperienceList: z
    .array(
      z.object({
        companyLocation: z.string(),
        companyName: z.string(),
        jobDescription: z.string(),
        jobDuration: durationSchema,
        jobTitle: z.string()
      })
    )
    .nullable()
    .optional(),
  knowledgeOfLanguageList: z.array(
    z.object({
      isNativeLanguage: z.boolean(),
      language: z.string(),
      languageDegree: z.string()
    })
  ),
  mainDegreeOfQualification: z.string(),
  patronymic: z.string(),
  personLocation: z.string(),
  phone: z.string(),
  profession: z.string(),
  projectExperienceList: z
    .array(
      z.object({
        projectDescription: z.string(),
        projectName: z.string()
      })
    )
    .nullable()
    .optional(),
  skillList: z.array(
    z.object({
      skillDescription: z.string(),
      skillLevel: z.string(),
      skillName: z.string()
    })
  ),
  surname: z.string(),
  testsOfExamsOrTraining: z.array(
    z.object({
      description: z.string(),
      duration: durationSchema,
      title: z.string()
    })
  )
});
