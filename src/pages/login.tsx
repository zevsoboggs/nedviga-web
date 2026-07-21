import { useEffect, useRef, useState } from 'react';
import { useLogin } from '@refinedev/core';
import { Button, Card, Form, Input, Spin, Tabs, Typography } from 'antd';
import { LockOutlined, MailOutlined, QrcodeOutlined, MobileOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';
import { apiFetch, setToken } from '../api';

const { Title, Text } = Typography;
const BOT = 'nedvigacrm_bot';

function PasswordForm() {
  const { mutate: login, isLoading } = useLogin();
  return (
    <Form layout="vertical" onFinish={(values) => login(values)} requiredMark={false}>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}>
        <Input size="large" prefix={<MailOutlined />} placeholder="you@example.com" autoComplete="email" />
      </Form.Item>
      <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }]}>
        <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••" autoComplete="current-password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>Войти</Button>
    </Form>
  );
}

function QrLogin() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'approved' | 'expired'>('pending');
  const timer = useRef<any>(null);

  const start = async () => {
    setStatus('pending');
    const { sessionId } = await apiFetch<{ sessionId: string }>('POST', '/auth/qr/new');
    setSessionId(sessionId);
  };

  useEffect(() => {
    start();
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    clearInterval(timer.current);
    timer.current = setInterval(async () => {
      try {
        const r = await apiFetch<{ status: string; token?: string }>('GET', `/auth/qr/status?sessionId=${sessionId}`);
        if (r.status === 'approved' && r.token) {
          clearInterval(timer.current);
          setStatus('approved');
          setToken(r.token);
          setTimeout(() => window.location.assign('/'), 600);
        } else if (r.status === 'expired') {
          setStatus('expired');
          clearInterval(timer.current);
        }
      } catch {}
    }, 2500);
    return () => clearInterval(timer.current);
  }, [sessionId]);

  const link = sessionId ? `https://t.me/${BOT}?start=qr_${sessionId}` : '';

  return (
    <div style={{ textAlign: 'center' }}>
      <Text type="secondary">Откройте приложение в Telegram и отсканируйте QR (или наведите камеру телефона)</Text>
      <div style={{ margin: '18px auto', width: 210, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EEF2F7', borderRadius: 16, padding: 12 }}>
        {status === 'approved' ? (
          <div><QrcodeOutlined style={{ fontSize: 48, color: '#12B76A' }} /><div style={{ color: '#12B76A', fontWeight: 700, marginTop: 8 }}>Вход выполнен</div></div>
        ) : status === 'expired' ? (
          <div><Text type="secondary">QR истёк</Text><br /><Button size="small" onClick={start} style={{ marginTop: 8 }}>Обновить</Button></div>
        ) : link ? (
          <QRCodeSVG value={link} size={186} level="M" />
        ) : (
          <Spin />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#98A5B8', fontSize: 13 }}>
        <MobileOutlined /> Подтвердите вход в приложении
      </div>
    </div>
  );
}

export function Login() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #7FB0FF 0%, #3C7BFF 55%, #2A5FE0 100%)', padding: 24 }}>
      <Card style={{ width: 420, maxWidth: '100%', boxShadow: '0 24px 70px rgba(20,40,90,0.28)' }} bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img src={logo} alt="Nedviga" style={{ width: 72, height: 72 }} />
          <Title level={3} style={{ margin: '10px 0 0' }}>Nedviga.CRM</Title>
          <Text type="secondary">Веб-версия · вход для сотрудников</Text>
        </div>
        <Tabs
          centered
          items={[
            { key: 'pwd', label: <span><LockOutlined /> Пароль</span>, children: <PasswordForm /> },
            { key: 'qr', label: <span><QrcodeOutlined /> QR-код</span>, children: <QrLogin /> },
          ]}
        />
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 12 }}>
          Нет пароля? Задайте его в приложении (Telegram) → «Защитите аккаунт».
        </Text>
      </Card>
    </div>
  );
}
