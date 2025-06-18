const OpenAI = require("openai"); 
require('dotenv').config(); // .env 파일에서 환경 변수 불러오기
const fs = require('fs');
const axios = require("axios");
const path = require("path");


const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

const createImg = async (prompt) =>{
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt : prompt,
        n: 1,
        size: "1024x1024",
      });
      console.log("success")
      console.log(response.data[0].url);
      const imageUrl = response.data[0].url;
      const fileName = generateFileName("png"); 
      const savePath = path.join("../frontend/public/uploads", fileName);
    await downloadImage(imageUrl, savePath);
    console.log(`Image saved to ${savePath}`);
      return "/uploads/"+fileName;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  };
  const generateFileName = (extension = "png") => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `image-${timestamp}.${extension}`;
  };
  const downloadImage = async (url, filePath) => {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
  
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  };
const createChatCompletion = async (img1, img2) => {

    try {

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages:[
            {"role": "system", "content": "Chat detailing the image to request DALL-E 3 to create the image"},
{"role": "user", "content": [
                { type: "text", text: "Instructions for drawing a one person must wearing the top in the first image and the bottoms in the second image." },
          { type: "image_url", image_url: {
            "url" : "http://ceprj.gachon.ac.kr:60011/" + img1 }
          },
          { type: "image_url", image_url: {
            "url" : "http://ceprj.gachon.ac.kr:60011/" + img2 }
          }
            ]}
        ],
      });
  
      const imgprompt = response.choices[0].message.content;
      console.log(response.choices[0].message.content);
      console.log(response);
      const usage = response.usage;
      console.log(usage.prompt_tokens);
      console.log(usage.completion_tokens);
      console.log(usage.total_tokens);
      
      const imgresponse = createImg(imgprompt);
      console.log(imgresponse);
      return imgresponse;
    } catch (error) {
      console.error('Error creating chat completion:', error);
    }
  
  };


  module.exports = createChatCompletion;

