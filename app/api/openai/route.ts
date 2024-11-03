// pages/api/openai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variables for security
});

export const POST = async(req: Request) => {
  console.log("Chegouu");

  const {imageUrl} = await req.json()
  console.log(imageUrl);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze the provided image to extract the brand name, volume (in liters, milliliters, or other units), and price. If these details are found in the image, return them in the following JSON format without syntax highlighting: {brand: <beer brand>, volume: <beer volume>, price: <beer price>}" },
            {
              type: "image_url",
              image_url: {url: imageUrl},
            },
          ],
        },
      ],
    });
    console.log("RESPOSTA",response.choices[0]);

    return new Response(JSON.stringify(response.choices[0].message.content))

return new Response("ok")
 
}

