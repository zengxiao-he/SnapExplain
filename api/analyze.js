// api/analyze.js
import multer from 'multer';
import { OpenAI } from 'openai';

const upload = multer();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    await new Promise((resolve, reject) =>
        upload.single('image')(req, res, err => err ? reject(err) : resolve())
    );

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const question = req.body.question || '请解释这段图片的内容。';
    const b64 = req.file.buffer.toString('base64');

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: question },
                        { type: 'image_url', image_url: { url: 'data:image/png;base64,' + b64 } }
                    ]
                }
            ]
        });

        const answer = response.choices[0].message.content;
        return res.status(200).json({ answer });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: '处理失败' });
    }
}
