import { Form, Input, Select, Space, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TranslationConfig = ({ config, onConfigChange }) => {
  const [form] = Form.useForm();
  const [modelOptions, setModelOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      if (!config.baseUrl || !config.apiKey) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${config.baseUrl}/v1/models`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
          },
        });

        // 过滤出支持聊天的模型
        const chatModels = response.data.data
          // .filter(model => model.id.includes('gpt'))
          .map(model => ({
            value: model.id,
            label: model.id
          }));

        setModelOptions(chatModels);
      } catch (error) {
        message.error('获取模型列表失败: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [config.baseUrl, config.apiKey, setModelOptions]);

  const handleValuesChange = (changedValues, allValues) => {
    onConfigChange(allValues);
  };

  const languageOptions = [
    { value: 'auto', label: '自动检测' },
    { value: 'en', label: '英语' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日语' },
    { value: 'ko', label: '韩语' },
    { value: 'fr', label: '法语' },
    { value: 'de', label: '德语' },
  ];

  return (
    <Form
      form={form}
      initialValues={config}
      onValuesChange={handleValuesChange}
      layout="vertical"
    >
      <Space style={{ width: '100%' }} direction="vertical">
        <Form.Item label="API Base URL" name="baseUrl">
          <Input placeholder="请输入API Base URL" />
        </Form.Item>

        <Form.Item label="API Key" name="apiKey">
          <Input.Password placeholder="请输入API Key" />
        </Form.Item>

        <Space style={{ width: '100%' }}>
          <Form.Item label="源语言" name="sourceLanguage" style={{ width: 200 }}>
            <Select options={languageOptions} />
          </Form.Item>

          <Form.Item label="目标语言" name="targetLanguage" style={{ width: 200 }}>
            <Select options={languageOptions} />
          </Form.Item>

          <Form.Item label="翻译模型" name="models" style={{ width: 300 }}>
            <Select
              mode="multiple"
              placeholder="请选择翻译模型"
              options={modelOptions}
              loading={loading}
            />
          </Form.Item>
        </Space>
      </Space>
    </Form>
  );
};

export default TranslationConfig; 