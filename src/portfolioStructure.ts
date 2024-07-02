export interface PortfolioStructure {
  aboutMe: string;
  citizenship: string;
  city: string;
  educationList: EducationList[];
  email: string;
  firstName: string;
  fullName: string;
  jobExperienceList: JobExperienceList[];
  knowledgeOfLanguageList: KnowledgeOfLanguageList[];
  mainDegreeOfQualification: string;
  patronymic: string;
  personLocation: string;
  phone: string;
  profession: string;
  projectExperienceList: ProjectExperienceList[];
  skillList: SkillList[];
  surname: string;
  testsOfExamsOrTraining: AdvancedTraining[];
}

export interface Duration {
  end: string;
  start: string;
}

export interface AdvancedTraining {
  description: string;
  duration: Duration;
  title: string;
}

export interface KnowledgeOfLanguageList {
  isNativeLanguage: boolean;
  language: string;
  languageDegree: string;
}

export interface JobExperienceList {
  companyLocation: string;
  companyName: string;
  jobDescription: string;
  jobDuration: Duration;
  jobTitle: string;
}

export interface ProjectExperienceList {
  projectDescription: string;
  projectName: string;
}

export interface EducationList {
  degreeOfEducation: string;
  educationalInstitution: string;
  educationDepartment: string;
  educationDuration: Duration;
  educationFaculty: string;
}

export interface SkillList {
  skillDescription: string;
  skillLevel: string;
  skillName: string;
}

const portfolioStructure: PortfolioStructure = {
  aboutMe: 'string',
  citizenship: 'string',
  city: 'string',
  educationList: [
    {
      degreeOfEducation: 'string',
      educationalInstitution: 'string',
      educationDepartment: 'string',
      educationDuration: {
        end: 'ISOString',
        start: 'ISOString'
      },
      educationFaculty: 'string'
    }
  ],
  email: 'string',
  firstName: 'string',
  fullName: 'string',
  jobExperienceList: [
    {
      companyLocation: 'string',
      companyName: 'string',
      jobDescription: 'string',
      jobDuration: {
        end: 'ISOString или null, если дата неизвестна',
        start: 'ISOString'
      },
      jobTitle: 'string'
    }
  ],
  knowledgeOfLanguageList: [
    {
      isNativeLanguage: false,
      language: 'string',
      languageDegree: 'number(Сгенерировать значение 0-100 на основе всех полученных данных)'
    }
  ],
  mainDegreeOfQualification: 'string',
  patronymic: 'string',
  personLocation: 'string',
  phone: 'string',
  profession: 'string',
  projectExperienceList: [
    {
      projectDescription: 'string',
      projectName: 'string'
    }
  ],
  skillList: [
    {
      skillDescription: 'string(Сгенерировать описание на основе названия навыка)',
      skillLevel: 'number(Сгенерировать значение 0-100 на основе всех полученных данных)',
      skillName: 'string'
    }
  ],
  surname: 'string',
  testsOfExamsOrTraining: [
    {
      description: 'string',
      duration: {
        end: 'ISOString',
        start: 'ISOString'
      },
      title: 'string'
    }
  ]
};

export default portfolioStructure;
