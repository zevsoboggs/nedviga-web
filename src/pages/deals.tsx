import { List, useTable } from '@refinedev/antd';
import { Table, Tag } from 'antd';

const fmt = (v?: number | null) => (v == null ? '—' : new Intl.NumberFormat('ru-RU').format(v) + ' ₸');
const STAGE: Record<string, { label: string; color: string }> = {
  LEAD: { label: 'Заявка', color: 'default' },
  QUALIFIED: { label: 'Квалификация', color: 'blue' },
  VIEWING: { label: 'Показ', color: 'cyan' },
  OFFER: { label: 'Оферта', color: 'gold' },
  CONTRACT: { label: 'Договор', color: 'orange' },
  CLOSED_WON: { label: 'Успех', color: 'green' },
  CLOSED_LOST: { label: 'Отказ', color: 'red' },
};

export function DealList() {
  const { tableProps } = useTable({ resource: 'deals', pagination: { mode: 'client', pageSize: 15 } });
  return (
    <List title="Сделки">
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="Название" ellipsis />
        <Table.Column
          title="Клиент"
          render={(_, r: any) => (r.client ? `${r.client.firstName} ${r.client.lastName ?? ''}` : '—')}
        />
        <Table.Column dataIndex="amount" title="Сумма" render={(v) => <b>{fmt(v)}</b>} />
        <Table.Column
          dataIndex="stage"
          title="Стадия"
          render={(v) => <Tag color={STAGE[v]?.color}>{STAGE[v]?.label ?? v}</Tag>}
        />
        <Table.Column dataIndex="probability" title="Вероятность" render={(v) => (v != null ? v + '%' : '—')} />
      </Table>
    </List>
  );
}
