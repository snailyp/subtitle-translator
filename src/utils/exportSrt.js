export const exportSRT = (subtitles) => {
  let content = "";

  subtitles.forEach((subtitle, index) => {
    // 序号
    content += `${subtitle.index}\n`;
    // 时间戳
    content += `${subtitle.timestamp}\n`;
    // 翻译内容（如果有选中的翻译就使用翻译，否则使用原文）
    const text = subtitle.selectedTranslation
      ? subtitle.translations[subtitle.selectedTranslation]
      : subtitle.originalText;
    content += `${text}\n\n`;
  });

  return content;
};
