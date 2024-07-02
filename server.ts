import express from "express";
import { v4 } from "uuid";

import cors from "cors";
import fetch from "node-fetch";
import multer from "multer";
import { getTextExtractor } from "office-text-extractor";
import * as path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

type IAM_TOKEN_RESPONSE = { iamToken: string };
type YA_GPT_PROMPT_REQ = {
  catalogId: string;
  systemMessage: string;
  userMessage: string;
};
export interface YaGPTResponse {
  result: {
    alternatives: Alterna[];
    usage: Usage;
    modelVersion: string;
  };
}

export interface Alterna {
  message: Message;
  status: string;
}

export interface Message {
  role: string;
  text: string;
}

export interface Usage {
  inputTextTokens: string;
  completionTokens: string;
  totalTokens: string;
}

// process.env.NODE_EXTRA_CA_CERTS = path.resolve(__dirname, "certs");
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const API_KEY = "sk-CG4rQJHAemrxha7DRwgRYjrtbzLKOcPq";
const app = express();
const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: "https://api.proxyapi.ru/openai/v1",
});
const port = 3001;
const YA_GPT_URL =
  "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
const YA_FOLDER_ID = "b1g95cs8uftq7flq5ke4";
const YA_IAM_TOKEN_URL = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
const YA_OAUTH_TOKEN =
  "y0_AgAAAABMeApeAATuwQAAAAEB6SaLAADaS-0yNlFNPZGo5xQdFI0km02Dqw";
const PROMPT_JSON_STRUCTURE = `{
    "firstName": "",
    "profession": "",
    "surname": "",
    "patronymic": "",
    "fullName": "",
    "email": "",
    "phone": "",
    "aboutMe": "",
    "jobExperienceList": [
      {
        "jobTitle": "",
        "jobDescription": "",
        "companyName": "",
        "jobDuration": "",
        "companyLocation": ""
      }
    ],
    "projectExperienceList": [
      {
        "projectName": "",
        "projectDescription": ""
      }
    ],
    "educationList": [
      {
        "degreeOfEducation": "",
        "educationalInstitution": "",
        "educationDuration": "",
        "educationFaculty": "",
        "educationDepartment": ""
      }
    ],
    "skillList": [
      {
        "skillName": "",
        "skillLevel": "",
        "skillDescription": ""
      }
    ]
  }`;
const TEXT_TO_PORTFOLIO_PROMPT = `Преобразуйте следующий текст и сгенерируйте описание навыка и степенью владения навыка (от 0% до 100%) на основе общего трудового стажа и опыта использование в работе в структурированные данные в формате JSON: ${PROMPT_JSON_STRUCTURE}`;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];
const extractor = getTextExtractor();

function getFileExt(originalname: string) {
  return originalname.substring(
    originalname.lastIndexOf("."),
    originalname.length
  );
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    const extname = getFileExt(file.originalname);

    const id = v4();

    console.log(id.toString());

    cb(null, `${id}${extname}`);
  },
});

const upload = multer({ storage });

app.use(express.static("dist"));
app.use(cors());

// app.use(bodyParser.json());
// app.use(cors());

app.post("/yagpt", upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("File not found!");
    }

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      throw new Error("Not allowed mime type");
    }

    const extname = getFileExt(req.file.originalname).replace(/./, "");

    if (!ALLOWED_EXTENSIONS.includes(extname)) {
      throw new Error("Not allowed extension");
    }

    const text = await extractor.extractText({
      input: req.file.path,
      type: "file",
    });

    // const completion = await axios.post(
    //   "https://api.proxyapi.ru/openai/v1/chat/completions",
    //   {
    //     // model: "gpt-4-turbo",
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //       { role: "system", content: TEXT_TO_PORTFOLIO_PROMPT },
    //       { role: "user", content: text },
    //     ],
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${API_KEY}`,
    //     },
    //   }
    // );

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: TEXT_TO_PORTFOLIO_PROMPT },
        { role: "user", content: text },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });
    const portfolioData = completion.choices[0]?.message.content;
    const parsedPortfolio = JSON.parse(portfolioData);
    const data = {
      portfolio: parsedPortfolio,
      resumeFileName: req.file.originalname,
    };

    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function fetchYaGPT(
  iamToken: string,
  prompt: ReturnType<typeof getSystemUserMessagePrompt>
): Promise<YaGPTResponse> {
  const res = await fetch(YA_GPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-folder-id": YA_FOLDER_ID,
      Authorization: `Bearer ${iamToken}`,
    },
    body: JSON.stringify(prompt),
  });

  return res.json() as Promise<YaGPTResponse>;
}

async function fetchIAMToken(oauthToken: string): Promise<IAM_TOKEN_RESPONSE> {
  const res = await fetch(YA_IAM_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      yandexPassportOauthToken: oauthToken,
    }),
  });

  return res.json() as Promise<IAM_TOKEN_RESPONSE>;
}

function getSystemUserMessagePrompt({
  catalogId,
  systemMessage,
  userMessage,
}: YA_GPT_PROMPT_REQ) {
  return {
    modelUri: `gpt://${catalogId}/yandexgpt/latest`,
    completionOptions: {
      stream: false,
      temperature: 0.01,
      maxTokens: "4000",
    },
    messages: [
      {
        role: "system",
        text: systemMessage,
      },
      {
        role: "user",
        text: userMessage,
      },
    ],
  };
}

async function getIAMToken() {
  const { iamToken } = await fetchIAMToken(YA_OAUTH_TOKEN);

  console.log({ iamToken });

  return iamToken;
}
