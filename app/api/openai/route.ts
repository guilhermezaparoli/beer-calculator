// pages/api/openai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variables for security
});

export const POST = async(req: Request) => {

  const {imageUrl} = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze the provided image to extract the full product name (including the brand and specific details), excluding the words 'Refrigerante' and 'Cerveja'. Also extract the volume (always convert to milliliters) and the price. If these details are found in the image, return them in the following JSON format without syntax highlighting: {brand: <full product name>, volume: <beer volume>, price: <beer price>}. If any of these keys are not found, return their values as null." },
            {
              type: "image_url",
              image_url: {url: imageUrl, detail: "auto"},
            },
          ],
        },
      ],
    });
    console.log("RESPOSTA",response.choices[0]);

    return new Response(JSON.stringify(response.choices[0].message.content))

 
}

