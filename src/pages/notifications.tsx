import { useEffect, useState } from 'react';
import { App, Badge, Button, Card, List, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { apiFetch } from '../api';

const { Text } = Typography;

export function NotificationsPage() {
  const { message } = App.useApp();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch<{ notifications: any[] }>('GET', '/notifications').then((r) => setRows(r.notifications)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const readAll = async () => {
    await apiFetch('POST', '/notifications/read-all');
    message.success('Все прочитаны');
    load();
  };

  return (
    <Card title="Уведомления" extra={<Button icon={<CheckOutlined />} onClick={readAll}>Прочитать все</Button>}>
      <List
        loading={loading}
        dataSource={rows}
        locale={{ emptyText: 'Нет уведомлений' }}
        renderItem={(n: any) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Badge dot={!n.read}><div style={{ width: 8 }} /></Badge>}
              title={n.title}
              description={
                <>
                  {n.body ? <div>{n.body}</div> : null}
                  <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(n.createdAt).format('DD.MM.YYYY HH:mm')}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
