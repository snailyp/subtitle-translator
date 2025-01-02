import { Layout, Typography } from 'antd';
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import SubtitleList from './components/SubtitleList';
import TranslationConfig from './components/TranslationConfig';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [subtitles, setSubtitles] = useState([]);
  const [translationConfig, setTranslationConfig] = useState({
    baseUrl: '',
    apiKey: '',
    models: [],
    sourceLanguage: 'auto',
    targetLanguage: 'zh'
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <Title level={3} style={{ margin: '16px 0' }}>字幕翻译工具</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FileUpload onSubtitlesLoad={setSubtitles} />
          <TranslationConfig 
            config={translationConfig}
            onConfigChange={setTranslationConfig}
          />
          <SubtitleList 
            subtitles={subtitles}
            translationConfig={translationConfig}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default App; 