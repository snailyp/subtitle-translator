import { Button, Checkbox, List, message, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { exportSRT } from '../utils/exportSrt';
import { getSubtitleContext, translateText } from '../utils/translator';

const { Text } = Typography;

const SubtitleList = ({ subtitles, translationConfig }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const handleTranslate = async () => {
    if (!translationConfig.apiKey || !translationConfig.models.length) {
      message.error('请先配置翻译设置');
      return;
    }

    setLoading(true);
    try {
      for (const index of selectedItems) {
        const subtitle = subtitles[index];
        const context = getSubtitleContext(subtitles, index);

        for (const model of translationConfig.models) {
          const translation = await translateText(
            subtitle.originalText,
            context,
            translationConfig,
            model
          );

          subtitle.translations[model] = translation;
          if (!subtitle.selectedTranslation) {
            subtitle.selectedTranslation = model;
          }
        }
      }
      message.success('翻译完成');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
      setSelectedItems([]);
    }
  };

  const handleSelectTranslation = (index, model) => {
    subtitles[index].selectedTranslation = model;
    // 强制更新组件
    setSelectedItems([...selectedItems]);
  };

  const handleExport = () => {
    try {
      const content = exportSRT(subtitles);
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'translated_subtitles.srt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败: ' + error.message);
    }
  };

  const renderItem = (item, index) => (
    <List.Item>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Checkbox
            checked={selectedItems.includes(index)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems([...selectedItems, index]);
              } else {
                setSelectedItems(selectedItems.filter(i => i !== index));
              }
            }}
          />
          <Text type="secondary">{item.index}</Text>
          <Text type="secondary">{item.timestamp}</Text>
        </Space>
        
        <Text strong>{item.originalText}</Text>

        {Object.entries(item.translations).map(([model, translation]) => (
          <Space key={model}>
            <Tag color={item.selectedTranslation === model ? 'blue' : 'default'}>
              {model}
            </Tag>
            <Text>{translation}</Text>
            <Button
              type="link"
              size="small"
              onClick={() => handleSelectTranslation(index, model)}
            >
              选择此翻译
            </Button>
          </Space>
        ))}
      </Space>
    </List.Item>
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Checkbox
          checked={selectedItems.length === subtitles.length}
          indeterminate={selectedItems.length > 0 && selectedItems.length < subtitles.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems(subtitles.map((_, index) => index));
            } else {
              setSelectedItems([]);
            }
          }}
        >
          全选
        </Checkbox>
        <Button
          type="primary"
          onClick={handleTranslate}
          loading={loading}
          disabled={selectedItems.length === 0}
        >
          翻译选中项
        </Button>
        <Tooltip title="导出翻译后的字幕文件">
          <Button 
            onClick={handleExport}
            disabled={subtitles.length === 0}
          >
            导出SRT
          </Button>
        </Tooltip>
      </Space>

      <List
        bordered
        dataSource={subtitles}
        renderItem={renderItem}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
        }}
      />
    </div>
  );
};

export default SubtitleList; 