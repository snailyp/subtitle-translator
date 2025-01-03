import { Card } from 'antd';
import React from 'react';
import SubtitleList from './SubtitleList';

const SubtitleBox = ({ subtitles, translationConfig }) => {
  return (
    <Card title="字幕列表" style={{ marginBottom: 20 }}>
      <SubtitleList
        subtitles={subtitles}
        translationConfig={translationConfig}
      />
    </Card>
  );
};

export default SubtitleBox; 