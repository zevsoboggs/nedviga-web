import { useLogin } from '@refinedev/core';
import { Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function Login() {
  const { mutate: login, isLoading } = useLogin();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #7FB0FF 0%, #3C7BFF 55%, #2A5FE0 100%)',
        padding: 24,
      }}
    >
      <Card style={{ width: 400, maxWidth: '100%', boxShadow: '0 20px 60px rgba(20,40,90,0.25)' }} bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 44 }}>🏠</div>
          <Title level={3} style={{ margin: '8px 0 0' }}>
            Nedviga.CRM
          </Title>
          <Text type="secondary">Веб-версия · вход для сотрудников</Text>
        </div>

        <Form layout="vertical" onFinish={(values) => login(values)} requiredMark={false}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="you@example.com" autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••" autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
            Войти
          </Button>
        </Form>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16, fontSize: 12 }}>
          Нет пароля? Задайте его в мобильном приложении (Telegram) → «Защитите аккаунт».
        </Text>
      </Card>
    </div>
  );
}
