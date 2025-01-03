// 解析时间戳为秒数
export const parseTimestamp = (timestamp) => {
  const [time, ms] = timestamp.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
};

// 格式化秒数为时间戳
export const formatTimestamp = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
};

// 合并字幕
export const mergeSubtitles = (subtitles, timeGapThreshold) => {
  if (!subtitles.length) return [];

  return subtitles.reduce((result, subtitle, index) => {
    if (index === 0) {
      result.push({ ...subtitle });
      return result;
    }

    const lastMerged = result[result.length - 1];
    const [currentStart, currentEnd] = lastMerged.timestamp
      .split(" --> ")
      .map(parseTimestamp);
    const [nextStart, nextEnd] = subtitle.timestamp
      .split(" --> ")
      .map(parseTimestamp);

    if (nextStart - currentEnd <= timeGapThreshold) {
      // 合并字幕
      lastMerged.timestamp = `${formatTimestamp(
        currentStart
      )} --> ${formatTimestamp(nextEnd)}`;
      lastMerged.originalText = `${lastMerged.originalText} ${subtitle.originalText}`;

      // 合并翻译结果
      Object.keys(subtitle.translations).forEach((model) => {
        if (lastMerged.translations[model]) {
          lastMerged.translations[
            model
          ] = `${lastMerged.translations[model]} ${subtitle.translations[model]}`;
        } else {
          lastMerged.translations[model] = subtitle.translations[model];
        }
      });
    } else {
      result.push({ ...subtitle });
    }

    return result;
  }, []);
};
