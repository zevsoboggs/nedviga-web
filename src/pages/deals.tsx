import { useEffect, useState } from 'react';
import { App, Card, Select, Table, Tag, Typography } from 'antd';
import { apiFetch } from '../api';

const { Text } = Typography;
const fmt = (v?: number | null) => (v == null ? '—' : new Intl.NumberFormat('ru-RU').format(v) + ' ₸');
const STAGES = [
  { value: 'LEAD', label: 'Заявка', color: 'default' },
  { value: 'QUALIFIED', label: 'Квалификация', color: 'blue' },
  { value: 'VIEWING', label: 'Показ', color: 'cyan' },
  { value: 'OFFER', label: 'Оферта', color: 'gold' },
  { value: 'CONTRACT', label: 'Договор', color: 'orange' },
  { value: 'CLOSED_WON', label: 'Успех', color: 'green' },
  { value: 'CLOSED_LOST', label: 'Отказ', color: 'red' },
];

export function DealList() {
  const { message } = App.useApp();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch<{ deals: any[] }>('GET', '/deals').then((r) => setRows(r.deals)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const move = async (id: string, stage: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, stage } : r)));
    try {
      await apiFetch('PATCH', `/deals/${id}`, { stage });
      message.success('Стадия изменена');
    } catch (e: any) {
      message.error(e?.message ?? 'Ошибка');
      load();
    }
  };

  return (
    <Card title="Сделки">
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        Двигайте сделки по воронке — меняйте стадию в колонке справа.
      </Text>
      <Table dataSource={rows} rowKey="id" loading={loading} pagination={{ pageSize: 15 }}>
        <Table.Column dataIndex="title" title="Название" ellipsis />
        <Table.Column title="Клиент" render={(_, r: any) => (r.client ? `${r.client.firstName} ${r.client.lastName ?? ''}` : '—')} />
        <Table.Column dataIndex="amount" title="Сумма" render={(v) => <b>{fmt(v)}</b>} />
        <Table.Column dataIndex="probability" title="Вероятность" render={(v) => (v != null ? v + '%' : '—')} />
        <Table.Column
          title="Стадия"
          width={200}
          render={(_, r: any) => (
            <Select
              value={r.stage}
              style={{ width: 180 }}
              onChange={(v) => move(r.id, v)}
              options={STAGES.map((s) => ({ value: s.value, label: <Tag color={s.color} style={{ margin: 0 }}>{s.label}</Tag> }))}
            />
          )}
        />
      </Table>
    </Card>
  );
}
