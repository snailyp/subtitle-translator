import { Tabs } from 'antd';
import React from 'react';
import SubtitleMerger from './SubtitleMerger';

const ToolBox = ({ subtitles, onSubtitlesChange }) => {
  const items = [
    {
      key: 'merger',
      label: '字幕合并',
      children: <SubtitleMerger 
        subtitles={subtitles}
        onSubtitlesChange={onSubtitlesChange}
      />,
    }
  ];

  return (
    <Tabs items={items} />
  );
};

export default ToolBox; 