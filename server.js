const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const upload = multer();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const { question } = req.body;
    const imageBuffer = req.file.buffer;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-vision',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question || '请解释这张图片的主要内容' },
            { type: 'image', image: imageBuffer.toString('base64') },
          ],
        }
      ],
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '出错了' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server is running on port 3000');
});
