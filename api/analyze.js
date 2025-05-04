// api/analyze.js
import multer from 'multer';
import { OpenAI } from 'openai';

const upload = multer();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // 处理 multipart/form-data
  await new Promise((resolve, reject) =>
    upload.single('image')(req, res, err => err ? reject(err) : resolve())
  );

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const question = req.body.question || '';
  const b64 = req.file.buffer.toString('base64');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',  // 换成你有权限的模型
      messages: [
        { role: 'user', content: question || '请解释这段文字的含义。' },
        { role: 'user',
          type: 'image',
          image: { data: b64 },
          content: ''   // ⚠️ 必须有
        },
      ],
    });

    const answer = response.choices[0].message.content;
    return res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '处理失败' });
  }
}
