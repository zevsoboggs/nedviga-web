import { useEffect, useState, type ReactNode } from 'react';
import { Alert, Button, Typography } from 'antd';
import { ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import art from '../assets/maintenance.png';
import { apiFetch } from '../api';

const { Title, Text } = Typography;

interface Status {
  maintenance: boolean;
  maintenanceMsg: string | null;
  isSuperAdmin: boolean;
}

export function MaintenanceGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [checking, setChecking] = useState(false);

  const load = () => apiFetch<Status>('GET', '/system/status').then(setStatus).catch(() => {});
  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  const retry = async () => {
    setChecking(true);
    await load();
    setChecking(false);
  };

  // Блокируем всех, кроме супер-админа
  if (status?.maintenance && !status.isSuperAdmin) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'linear-gradient(135deg, #7FB0FF 0%, #3C7BFF 55%, #2A5FE0 100%)',
        }}
      >
        <div
          style={{
            width: 440,
            maxWidth: '100%',
            padding: '40px 36px',
            borderRadius: 28,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            backdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 30px 80px rgba(20,40,90,0.35)',
          }}
        >
          <img src={art} alt="" style={{ width: 170, height: 170 }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(247,144,9,0.14)', color: '#F79009', fontWeight: 700, fontSize: 12, padding: '6px 12px', borderRadius: 999, marginTop: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: '#F79009' }} /> ТЕХНИЧЕСКИЕ РАБОТЫ
          </div>
          <Title level={3} style={{ margin: '14px 0 0' }}>Скоро вернёмся</Title>
          <Text type="secondary" style={{ display: 'block', marginTop: 8, lineHeight: 1.6 }}>
            {status.maintenanceMsg || 'Мы улучшаем Nedviga.CRM. Сервис ненадолго недоступен — ваши данные в безопасности.'}
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#98A5B8', fontSize: 13, marginTop: 18 }}>
            <ClockCircleOutlined /> Плановые работы · Астана
          </div>
          <Button type="primary" size="large" block icon={<ReloadOutlined />} loading={checking} onClick={retry} style={{ marginTop: 22 }}>
            Проверить снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {status?.maintenance && status.isSuperAdmin && (
        <Alert
          type="warning"
          showIcon
          banner
          message="Режим технических работ включён — обычные сотрудники видят заглушку. Вы вошли как супер-админ."
          style={{ margin: '16px 16px 0' }}
        />
      )}
      {children}
    </>
  );
}
