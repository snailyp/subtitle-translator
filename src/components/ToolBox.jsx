import { Card, Tabs } from 'antd';
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
    <Card title="工具箱" style={{ marginBottom: 20 }}>
      <Tabs items={items} />
    </Card>
  );
};

export default ToolBox; 