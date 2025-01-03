import React from 'react';
import TranslationConfig from './TranslationConfig';

const ConfigBox = ({ config, onConfigChange }) => {
  return (
    <TranslationConfig 
      config={config}
      onConfigChange={onConfigChange}
    />
  );
};

export default ConfigBox; 