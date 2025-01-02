import axios from "axios";

export const translateText = async (text, context = "", config, model) => {
  const { baseUrl, apiKey, sourceLanguage, targetLanguage } = config;

  const messages = [
    {
      role: "system",
      content: `你是一个专业的翻译助手。请将以下${sourceLanguage}文本翻译成${targetLanguage}。
                保持原文的语气和风格，确保翻译的自然流畅。
                上下文信息：${context}`,
    },
    {
      role: "user",
      content: text,
    },
  ];

  try {
    const response = await axios.post(
      `${baseUrl}/v1/chat/completions`,
      {
        model,
        messages,
        temperature: 0.3,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(`翻译失败: ${error.message}`);
  }
};

// 获取字幕上下文
export const getSubtitleContext = (
  subtitles,
  currentIndex,
  contextSize = 2
) => {
  const start = Math.max(0, currentIndex - contextSize);
  const end = Math.min(subtitles.length - 1, currentIndex + contextSize);

  return subtitles
    .slice(start, end + 1)
    .map((s) => s.originalText)
    .join("\n");
};
