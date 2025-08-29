import axios from 'axios';
import cors from 'cors';
import express from 'express';
import FormData from 'form-data';
import OpenAI from 'openai';
import { RESUME_FIELD_NAME } from './consts.js';
import { enviroments } from './enviroments.js';
import { getPortfolio } from './getPortfolio.js';
import { getPrompt } from './getPrompt.js';
import { resumeSchema } from './resumeSchema.js';
import { FileStorageUploadResponse } from './types.js';
import { uploadMulter } from './uploadResume.js';

const PROMPT_SRC = `${process.cwd()}/src/PROMPT.md`;
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

const { fileStorageApiURL, openAiApiKey, openAiBaseURL, port } = enviroments;

const app = express();

const openai = new OpenAI({
  apiKey: openAiApiKey,
  baseURL: openAiBaseURL
});

const fileStorageApi = axios.create({
  baseURL: fileStorageApiURL
});

app.use(cors());

const TRUE_STRING = 'TRUE';

app.post('/generate-portfolio', uploadMulter.single(RESUME_FIELD_NAME), async (req, res) => {
  try {
    const formData = new FormData();

    formData.append(RESUME_FIELD_NAME, req.file?.buffer, req.file?.originalname);

    const response = await fileStorageApi.post<FileStorageUploadResponse>('/upload', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    const { data: storageData } = response;
    const { imagesList, resumeUrl, text } = storageData;

    console.log({ storageData });

    const analysisHumanPhotoPromises = imagesList.map((url) =>
      openai.chat.completions
        .create({
          messages: [
            {
              content: [
                {
                  text: 'Если на изображении есть человек, напишите "TRUE", иначе "FALSE"',
                  type: 'text'
                },
                {
                  image_url: {
                    url
                  },
                  type: 'image_url' as const
                }
              ],
              role: 'user'
            }
          ],
          model: 'gpt-4-vision-preview',
          response_format: {
            type: 'text'
          }
        })
        .then((data) => ({
          data,
          url
        }))
    );

    const analysisHumanPhoto = await Promise.allSettled(analysisHumanPhotoPromises);
    console.log({ analysisHumanPhotoPromises });
    let avatarPath = '';

    try {
      for (const item of analysisHumanPhoto) {
        if (item.status !== 'fulfilled') continue;

        const { data, url } = item.value;

        const [firstImageChoice] = data.choices;
        const content = firstImageChoice?.message?.content || '';
        const parsedContent = content.trim().toUpperCase();

        console.log(content);

        if (parsedContent !== TRUE_STRING) continue;

        avatarPath = url;
      }
    } catch (err) {
      console.log({ err });
    }

    console.log(avatarPath);

    const systemPrompt = await getPrompt(PROMPT_SRC);

    console.log({ systemPrompt });

    const completion = await openai.chat.completions.create({
      messages: [
        { content: systemPrompt, role: 'system' },
        { content: text, role: 'user' }
      ],
      model: 'gpt-4o',
      response_format: {
        type: 'json_object'
      },
      temperature: 0
    });

    console.log({ completion });

    const portfolioData = completion.choices[0]?.message.content;

    console.log({ portfolioData });

    if (!portfolioData) {
      throw new Error(
        'Отсуствуют данные для генерации портфолио. Возможно, ваш файл не соответсвует резюме'
      );
    }

    const portfolioParsed = JSON.parse(portfolioData);
    console.log({ portfolioParsed });
    const data = getPortfolio(portfolioParsed);
    console.log({ data });

    const { success } = resumeSchema.safeParse(data.portfolio);

    console.log({ success });

    if (!success) {
      throw new Error(
        'Ошибка при валидации схемы данных. Возможно, ваш файл не соответсвует резюме'
      );
    }

    console.log({ avatarPath, data, resumeUrl });

    res.json({ ...data, avatarPath, resumeUrl });
  } catch (error) {
    console.log('error', JSON.stringify(error));
    res.status(400).json({ data: JSON.stringify(error), error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
