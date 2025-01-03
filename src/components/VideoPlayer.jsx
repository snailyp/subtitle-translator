import { InboxOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Card, Space, Upload, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { parseTimestamp } from '../utils/subtitleUtils';

const { Dragger } = Upload;

const VideoPlayer = ({ subtitles }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  const [scale, setScale] = useState(() => {
    return localStorage.getItem('videoScale') || 0.4;
  });
  const [position, setPosition] = useState(() => {
    return JSON.parse(localStorage.getItem('videoPosition')) || { x: 20, y: 20 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFixed, setIsFixed] = useState(false);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 保存设置到 localStorage
  useEffect(() => {
    localStorage.setItem('videoScale', scale);
    localStorage.setItem('videoPosition', JSON.stringify(position));
  }, [scale, position]);

  const findCurrentSubtitle = useCallback((time) => {
    for (const subtitle of subtitles) {
      const [start, end] = subtitle.timestamp.split(' --> ').map(parseTimestamp);
      if (time >= start && time <= end) {
        return subtitle;
      }
    }
    return null;
  }, [subtitles]);

  useEffect(() => {
    const subtitle = findCurrentSubtitle(currentTime);
    setCurrentSubtitle(subtitle);
  }, [currentTime, findCurrentSubtitle]);

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'video/*',
    beforeUpload: (file) => {
      const videoUrl = URL.createObjectURL(file);
      setVideoUrl(videoUrl);
      message.success(`${file.name} 视频已加载`);
      return false;
    },
    onRemove: () => {
      setVideoUrl(null);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.ant-card-head')) {
      const windowWidth = window.innerWidth;
      setIsDragging(true);
      setDragStart({
        x: position.x - (windowWidth - e.clientX),
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const windowWidth = window.innerWidth;
      setPosition({
        x: windowWidth - e.clientX + dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const renderSubtitle = () => {
    if (!currentSubtitle) return null;
    
    const text = currentSubtitle.selectedTranslation
      ? currentSubtitle.translations[currentSubtitle.selectedTranslation]
      : currentSubtitle.originalText;

    return (
      <div style={{
        padding: '10px',
        textAlign: 'center',
        fontSize: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '4px',
        maxWidth: '80%',
        zIndex: 1
      }}>
        {text}
      </div>
    );
  };

  return (
    <Card 
      title={
        <div style={{ cursor: isFixed ? 'move' : 'default' }}>
          视频预览
          <Space style={{ marginLeft: 16 }}>
            <Button
              icon={<ZoomOutOutlined />}
              onClick={() => setScale(s => Math.max(0.2, s - 0.1))}
            />
            <Button
              icon={<ZoomInOutlined />}
              onClick={() => setScale(s => Math.min(1, s + 0.1))}
            />
          </Space>
        </div>
      }
      style={{ 
        position: isFixed ? 'fixed' : 'relative',
        right: isFixed ? position.x : 'auto',
        top: isFixed ? position.y : 'auto',
        width: isFixed ? '40%' : '100%',
        transform: isFixed ? `scale(${scale})` : 'none',
        transformOrigin: 'top right',
        zIndex: isFixed ? 1000 : 1,
        backgroundColor: '#fff',
        boxShadow: isFixed ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
        cursor: isDragging ? 'move' : 'auto',
        marginBottom: isFixed ? 0 : 20
      }}
      onMouseDown={handleMouseDown}
    >
      {!videoUrl ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽视频文件到此区域</p>
        </Dragger>
      ) : (
        <div style={{ position: 'relative' }}>
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="auto"
            onProgress={handleProgress}
            progressInterval={100}
          />
          {renderSubtitle()}
        </div>
      )}
    </Card>
  );
};

export default VideoPlayer; 