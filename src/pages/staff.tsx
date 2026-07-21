import { useState } from 'react';
import { List, useTable } from '@refinedev/antd';
import { App, Avatar, Button, Input, Space, Table, Tag } from 'antd';
import { UsergroupAddOutlined, CopyOutlined } from '@ant-design/icons';
import { apiFetch } from '../api';

const ROLE: Record<string, { label: string; color: string }> = {
  OWNER: { label: 'Владелец', color: 'green' },
  ADMIN: { label: 'Администратор', color: 'blue' },
  MANAGER: { label: 'Менеджер', color: 'geekblue' },
  ASSISTANT: { label: 'Ассистент', color: 'gold' },
  VIEWER: { label: 'Наблюдатель', color: 'default' },
};

export function StaffList() {
  const { tableProps } = useTable({ resource: 'staff', pagination: { mode: 'client', pageSize: 20 } });
  const { message } = App.useApp();
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const invite = async () => {
    setBusy(true);
    try {
      const res = await apiFetch<{ link: string }>('POST', '/staff/invite');
      setLink(res.link);
      message.success('Ссылка-приглашение создана');
    } catch (e: any) {
      message.error(e?.message ?? 'Не удалось создать ссылку');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    message.success('Скопировано');
  };

  return (
    <List
      title="Сотрудники"
      headerButtons={
        <Button type="primary" icon={<UsergroupAddOutlined />} loading={busy} onClick={invite}>
          Пригласить
        </Button>
      }
    >
      {link && (
        <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
          <Input value={link} readOnly />
          <Button icon={<CopyOutlined />} onClick={copy}>
            Копировать
          </Button>
        </Space.Compact>
      )}
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="Сотрудник"
          render={(_, r: any) => (
            <Space>
              <Avatar src={r.avatarUrl}>{r.firstName?.[0]}</Avatar>
              <span>
                {r.firstName} {r.lastName ?? ''}
                {r.username ? <span style={{ color: '#98A5B8' }}> @{r.username}</span> : null}
              </span>
            </Space>
          )}
        />
        <Table.Column
          dataIndex="role"
          title="Роль"
          render={(v) => <Tag color={ROLE[v]?.color}>{ROLE[v]?.label ?? v}</Tag>}
        />
        <Table.Column
          dataIndex="lastSeenAt"
          title="Был(а)"
          render={(v) => (v ? new Date(v).toLocaleString('ru-RU') : '—')}
        />
      </Table>
    </List>
  );
}
