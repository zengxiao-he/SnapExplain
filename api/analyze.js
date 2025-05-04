// api/analyze.js
import multer from 'multer'
import { OpenAI } from 'openai'

const upload = multer()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }
  await new Promise((resolve, reject) =>
    upload.single('image')(req, res, err => err ? reject(err) : resolve())
  )

  const apiKey = process.env.OPENAI_API_KEY
  const openai = new OpenAI({ apiKey })

  // 如果前端同时发了 question 字段
  const question = req.body.question || ''

  // 把文件转 base64
  const b64 = req.file.buffer.toString('base64')

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-vision',   // 或者 'gpt-4o-mini'
    messages: [
      // 文字上下文
      { role: 'user', content: question || '请解释这张图片中的内容' },
      // 图片
      { role: 'user', type: 'image', image: { data: b64 } },
    ],
  })

  const answer = response.choices[0].message.content
  return res.status(200).json({ answer })
}
