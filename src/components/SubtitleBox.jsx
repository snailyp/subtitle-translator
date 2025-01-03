import React from 'react';
import SubtitleList from './SubtitleList';

const SubtitleBox = ({ subtitles, translationConfig }) => {
  return (
      <SubtitleList
        subtitles={subtitles}
        translationConfig={translationConfig}
      />
  );
};

export default SubtitleBox; 