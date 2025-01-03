import { TranslationOutlined } from '@ant-design/icons';
import { Layout, Space, Typography } from 'antd';
import React, { useState } from 'react';
import ConfigBox from './components/ConfigBox';
import FileUpload from './components/FileUpload';
import SubtitleBox from './components/SubtitleBox';
import ToolBox from './components/ToolBox';

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
      <Header style={{ 
        background: '#fff',
        padding: '0 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Space size={12}>
          <TranslationOutlined style={{ 
            fontSize: '24px',
            color: '#1890ff'
          }}/>
          <Title 
            level={3} 
            style={{ 
              margin: '16px 0',
              color: '#262626',
              fontWeight: 600
            }}
          >
            字幕翻译工具
          </Title>
        </Space>
      </Header>
      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FileUpload onSubtitlesLoad={setSubtitles} />
          <ConfigBox
            config={translationConfig}
            onConfigChange={setTranslationConfig}
          />
          <ToolBox
            subtitles={subtitles}
            onSubtitlesChange={setSubtitles}
          />
          <SubtitleBox 
            subtitles={subtitles}
            translationConfig={translationConfig}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default App; 