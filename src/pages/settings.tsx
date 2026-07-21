import { useEffect, useState } from 'react';
import { useGetIdentity, useLogout } from '@refinedev/core';
import { App, Avatar, Button, Card, Col, Descriptions, Row, Space, Switch, Tag, Typography } from 'antd';
import { LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { apiFetch } from '../api';

const { Text } = Typography;

export function SettingsPage() {
  const { data: identity } = useGetIdentity<any>();
  const { mutate: logout } = useLogout();
  const { message } = App.useApp();
  const [status, setStatus] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const load = () => apiFetch('GET', '/system/status').then(setStatus).catch(() => {});
  useEffect(() => { load(); }, []);

  const toggle = async (on: boolean) => {
    setBusy(true);
    try {
      await apiFetch('PATCH', '/system/maintenance', { maintenance: on, message: on ? 'Идут плановые технические работы. Скоро вернёмся!' : undefined });
      message.success(on ? 'Тех. работы включены' : 'Тех. работы выключены');
      load();
    } catch (e: any) {
      message.error(e?.message ?? 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={80} src={identity?.avatar} icon={<UserOutlined />} style={{ background: '#3B6EF2' }} />
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>{identity?.name}</div>
            <Tag color="blue" style={{ marginTop: 6 }}>{identity?.role}</Tag>
            <div style={{ color: '#64748B', marginTop: 6 }}>{identity?.agency}</div>
          </div>
          <Button danger block icon={<LogoutOutlined />} style={{ marginTop: 20 }} onClick={() => logout()}>Выйти</Button>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Система">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Версия">{status?.version ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="AI">{status?.aiEnabled ? <Tag color="green">включён</Tag> : <Tag>выключен</Tag>}</Descriptions.Item>
          </Descriptions>

          {status?.isSuperAdmin && (
            <Card size="small" style={{ marginTop: 12, background: '#FFFBEB', borderColor: '#FDE68A' }}>
              <Row align="middle" justify="space-between">
                <Col>
                  <Space><ToolOutlined style={{ color: '#F79009' }} /><b>Тех. работы · глобально</b></Space>
                  <div style={{ color: '#64748B', fontSize: 12 }}>Заблокирует вход ВСЕМ пользователям</div>
                </Col>
                <Col><Switch checked={status?.maintenance} loading={busy} onChange={toggle} /></Col>
              </Row>
            </Card>
          )}
        </Card>
      </Col>
    </Row>
  );
}
