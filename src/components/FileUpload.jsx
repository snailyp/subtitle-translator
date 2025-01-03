import { InboxOutlined } from '@ant-design/icons';
import { Card, Upload, message } from 'antd';
import React from 'react';
import { parseSRT } from '../utils/srtParser';

const { Dragger } = Upload;

const FileUpload = ({ onSubtitlesLoad }) => {
  const props = {
    name: 'file',
    multiple: false,
    accept: '.srt',
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const subtitles = parseSRT(content);
          onSubtitlesLoad(subtitles);
          message.success(`${file.name} 成功导入`);
        } catch (error) {
          message.error('文件解析失败');
        }
      };
      reader.readAsText(file);
      return false;
    },
  };

  return (
    <Card 
      title="字幕上传"
      style={{ marginBottom: 20 }}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽SRT文件到此区域</p>
      </Dragger>
    </Card>
  );
};

export default FileUpload; 