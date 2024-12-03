import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Nova, a helpful AI assistant that can help with tasks, scheduling, and home automation."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    const reply = completion.data.choices[0]?.message?.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('AI chat error:', error);
    return res.status(500).json({ message: 'Error processing your request' });
  }
}
