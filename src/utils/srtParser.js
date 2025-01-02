export const parseSRT = (content) => {
  const subtitles = [];
  const blocks = content.trim().split("\r\n\r\n");

  blocks.forEach((block) => {
    const lines = block.split("\r\n");
    if (lines.length >= 3) {
      const index = parseInt(lines[0]);
      const timestamp = lines[1];
      const text = lines.slice(2).join("\r\n");

      subtitles.push({
        index,
        timestamp,
        originalText: text,
        translations: {}, // 存储不同模型的翻译结果
        selectedTranslation: null, // 存储选中的翻译结果
      });
    }
  });

  return subtitles;
};
