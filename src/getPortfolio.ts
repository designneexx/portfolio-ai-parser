import {
  AdvancedTraining,
  Duration,
  EducationList,
  JobExperienceList,
  KnowledgeOfLanguageList,
  PortfolioStructure,
  ProjectExperienceList,
  SkillList
} from './portfolioStructure.js';

export interface PortfolioServiceResponse {
  portfolio: PortfolioStructure;
}

function validateStrField(value?: null | string): string {
  const str = `${value}`.trim();

  return str;
}

function validateBoolField(value?: boolean | null): boolean {
  const bool = Boolean(value);

  return bool;
}

function validateDuration(duration: Duration): Duration {
  return {
    end: duration.end,
    start: validateStrField(duration.start)
  };
}

function validateKnowledgeLanguageList({
  isNativeLanguage,
  language,
  languageDegree
}: KnowledgeOfLanguageList): KnowledgeOfLanguageList {
  return {
    isNativeLanguage: validateBoolField(isNativeLanguage),
    language: validateStrField(language),
    languageDegree: validateStrField(languageDegree)
  };
}

function validateAdvancedTraining({
  description,
  duration,
  title
}: AdvancedTraining): AdvancedTraining {
  return {
    description: validateStrField(description),
    duration: validateDuration(duration),
    title: validateStrField(title)
  };
}

function validateJobExperienceList({
  companyLocation,
  companyName,
  jobDescription,
  jobDuration,
  jobTitle
}: JobExperienceList): JobExperienceList {
  return {
    companyLocation: validateStrField(companyLocation),
    companyName: validateStrField(companyName),
    jobDescription: validateStrField(jobDescription),
    jobDuration: validateDuration(jobDuration),
    jobTitle: validateStrField(jobTitle)
  };
}

function validateProjectExperienceList({ projectDescription, projectName }: ProjectExperienceList) {
  return {
    projectDescription: validateStrField(projectDescription),
    projectName: validateStrField(projectName)
  };
}

function validateEducationList({
  degreeOfEducation,
  educationalInstitution,
  educationDepartment,
  educationDuration,
  educationFaculty
}: EducationList): EducationList {
  return {
    degreeOfEducation: validateStrField(degreeOfEducation),
    educationalInstitution: validateStrField(educationalInstitution),
    educationDepartment: validateStrField(educationDepartment),
    educationDuration: validateDuration(educationDuration),
    educationFaculty: validateStrField(educationFaculty)
  };
}

function validateSkillList({ skillDescription, skillLevel, skillName }: SkillList): SkillList {
  return {
    skillDescription: validateStrField(skillDescription),
    skillLevel: validateStrField(skillLevel),
    skillName: validateStrField(skillName)
  };
}

export function getPortfolio(portfolioStructure: PortfolioStructure): PortfolioServiceResponse {
  const {
    aboutMe,
    citizenship,
    city,
    email,
    firstName,
    fullName,
    mainDegreeOfQualification,
    patronymic,
    personLocation,
    phone,
    profession,
    surname
  }: PortfolioStructure = portfolioStructure;
  const jobExperienceList = portfolioStructure.jobExperienceList || [];
  const projectExperienceList = portfolioStructure.projectExperienceList || [];
  const educationList = portfolioStructure.educationList || [];
  const skillList = portfolioStructure.skillList || [];
  const advancedTrainingList = portfolioStructure.testsOfExamsOrTraining || [];
  const knowledgeOfLanguageList = portfolioStructure.knowledgeOfLanguageList || [];
  const portfolio: PortfolioServiceResponse['portfolio'] = {
    aboutMe: validateStrField(aboutMe),
    citizenship: validateStrField(citizenship),
    city: validateStrField(city),
    educationList: educationList.map(validateEducationList),
    email: validateStrField(email),
    firstName: validateStrField(firstName),
    fullName: validateStrField(fullName),
    jobExperienceList: jobExperienceList.map(validateJobExperienceList),
    knowledgeOfLanguageList: knowledgeOfLanguageList.map(validateKnowledgeLanguageList),
    mainDegreeOfQualification: validateStrField(mainDegreeOfQualification),
    patronymic: validateStrField(patronymic),
    personLocation: validateStrField(personLocation),
    phone: validateStrField(phone),
    profession: validateStrField(profession),
    projectExperienceList: projectExperienceList.map(validateProjectExperienceList),
    skillList: skillList.map(validateSkillList),
    surname: validateStrField(surname),
    testsOfExamsOrTraining: advancedTrainingList.map(validateAdvancedTraining)
  };
  const data = {
    portfolio
  };

  return data;
}
