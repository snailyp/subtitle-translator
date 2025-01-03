import { Button, InputNumber, Space } from 'antd';
import React, { useState } from 'react';
import { mergeSubtitles } from '../utils/subtitleUtils';

const SubtitleMerger = ({ subtitles, onSubtitlesChange }) => {
  const [timeGap, setTimeGap] = useState(0.5);

  const handleMerge = () => {
    const mergedSubtitles = mergeSubtitles(subtitles, timeGap);
    onSubtitlesChange(mergedSubtitles);
  };

  return (
    <Space>
      <span>时间差阈值(秒):</span>
      <InputNumber 
        value={timeGap}
        onChange={setTimeGap}
        min={0}
        max={10}
        step={0.1}
      />
      <Button 
        type="primary"
        onClick={handleMerge}
        disabled={!subtitles.length}
      >
        合并字幕
      </Button>
    </Space>
  );
};

export default SubtitleMerger; 