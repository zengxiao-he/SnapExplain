// api/analyze.js
import multer from 'multer';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';

const upload = multer();

export default async function handler(req = VercelRequest, res = VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  // multer 不能直接用在 serverless，需要一个小工具库
  await new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => err ? reject(err) : resolve());
  });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const question = req.body.question || '请解释这段文字的含义';

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: question }],
  });

  return res.status(200).json({ answer: response.choices[0].message.content });
}
