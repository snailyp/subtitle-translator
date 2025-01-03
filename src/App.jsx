import { GithubOutlined, HomeOutlined, TranslationOutlined } from '@ant-design/icons';
import { Avatar, Collapse, Layout, Space, Typography } from 'antd';
import React, { useState } from 'react';
import ConfigBox from './components/ConfigBox';
import FileUpload from './components/FileUpload';
import SubtitleBox from './components/SubtitleBox';
import ToolBox from './components/ToolBox';
import VideoPlayer from './components/VideoPlayer';

const { Header, Content, Footer } = Layout;
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
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          fontSize: '48px',
          color: 'rgba(0, 0, 0, 0.1)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100,
          userSelect: 'none'
        }}
      >
        @snaily
      </div>
      <Header style={{ 
        background: '#fff',
        padding: '0 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
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

        <Space size={20}>
          <Typography.Link href="https://linux.do/u/snaily" target="_blank">
            <Avatar 
              src="https://linux.do/user_avatar/linux.do/snaily/288/306510_2.gif"
              size="small"
            />
          </Typography.Link>
          <Typography.Link href="https://linux.do/u/snaily" target="_blank">
            <HomeOutlined /> snaily
          </Typography.Link>
          <Typography.Link href="https://github.com/snailyp/subtitle-translator" target="_blank">
            <GithubOutlined /> GitHub
          </Typography.Link>
        </Space>
      </Header>
      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FileUpload onSubtitlesLoad={setSubtitles} />
          <VideoPlayer subtitles={subtitles} />
          <Collapse 
            defaultActiveKey={['config', 'tools', 'subtitles']}
            style={{ marginBottom: 20 }}
          >
            <Collapse.Panel header="翻译配置" key="config">
              <ConfigBox
                config={translationConfig}
                onConfigChange={setTranslationConfig}
              />
            </Collapse.Panel>
            
            <Collapse.Panel header="工具箱" key="tools">
              <ToolBox
                subtitles={subtitles}
                onSubtitlesChange={setSubtitles}
              />
            </Collapse.Panel>
            
            <Collapse.Panel header="字幕列表" key="subtitles">
              <SubtitleBox 
                subtitles={subtitles}
                translationConfig={translationConfig}
              />
            </Collapse.Panel>
          </Collapse>
        </div>
      </Content>
      <Footer style={{
        textAlign: 'center',
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        padding: '12px 20px'
      }}>
        <Typography.Text type="secondary">
          Copyright © {new Date().getFullYear()} snaily. All rights reserved.
        </Typography.Text>
      </Footer>
    </Layout>
  );
}

export default App; 