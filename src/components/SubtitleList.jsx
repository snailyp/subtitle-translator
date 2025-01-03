import { Button, Checkbox, Dropdown, Input, List, Menu, message, Modal, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { exportSRT } from '../utils/exportSrt';
import { getSubtitleContext, translateText } from '../utils/translator';

const { Text } = Typography;

const SubtitleList = ({ subtitles, translationConfig }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingModel, setEditingModel] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // 计算当前页的字幕索引范围
  const getCurrentPageIndices = () => {
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, subtitles.length);
    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  // 选择当前页
  const selectCurrentPage = () => {
    setSelectedItems([...new Set([...selectedItems, ...getCurrentPageIndices()])]);
  };

  // 选择所有页
  const selectAllPages = () => {
    setSelectedItems(subtitles.map((_, index) => index));
  };

  // 取消所有选择
  const deselectAll = () => {
    setSelectedItems([]);
  };

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

  // 处理编辑
  const handleEdit = (index, model, text) => {
    setEditingIndex(index);
    setEditingModel(model);
    setEditingText(text);
    setModalVisible(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingIndex !== null && editingModel) {
      subtitles[editingIndex].translations[editingModel] = editingText;
      setModalVisible(false);
      setEditingIndex(null);
      setEditingModel(null);
      setEditingText('');
      // 强制更新组件
      setSelectedItems([...selectedItems]);
    }
  };

  // 处理删除
  const handleDelete = (index, model) => {
    delete subtitles[index].translations[model];
    if (subtitles[index].selectedTranslation === model) {
      subtitles[index].selectedTranslation = Object.keys(subtitles[index].translations)[0] || null;
    }
    // 强制更新组件
    setSelectedItems([...selectedItems]);
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
            <Space>
              <Button
                type="link"
                size="small"
                onClick={() => handleSelectTranslation(index, model)}
              >
                选择此翻译
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => handleEdit(index, model, translation)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定要删除这个翻译吗?"
                onConfirm={() => handleDelete(index, model)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" size="small" danger>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        ))}
      </Space>
    </List.Item>
  );

  const selectionMenu = (
    <Menu
      items={[
        {
          key: 'currentPage',
          label: '选择本页',
          onClick: selectCurrentPage,
        },
        {
          key: 'allPages',
          label: '选择所有',
          onClick: selectAllPages,
        },
      ]}
    />
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Dropdown.Button 
          overlay={selectionMenu}
          onClick={selectCurrentPage}
        >
          选择本页
        </Dropdown.Button>
        {selectedItems.length > 0 && (
          <Button onClick={deselectAll}>
            取消选择 ({selectedItems.length})
          </Button>
        )}
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
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page) => setCurrentPage(page),
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
        }}
      />

      <Modal
        title="编辑翻译"
        open={modalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Input.TextArea
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default SubtitleList; 