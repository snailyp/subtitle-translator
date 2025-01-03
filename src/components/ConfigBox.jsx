import { Card } from 'antd';
import React from 'react';
import TranslationConfig from './TranslationConfig';

const ConfigBox = ({ config, onConfigChange }) => {
  return (
    <Card title="翻译配置" style={{ marginBottom: 20 }}>
      <TranslationConfig 
        config={config}
        onConfigChange={onConfigChange}
      />
    </Card>
  );
};

export default ConfigBox; 