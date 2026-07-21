import { useEffect, useState } from 'react';
import { App, Button, Card, Col, Form, InputNumber, Modal, Row, Select, Statistic, Table, Tag, Typography } from 'antd';
import { PlusOutlined, WalletOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { apiFetch } from '../api';

const { Text } = Typography;
const fmt = (v?: number | null) => (v == null ? '—' : new Intl.NumberFormat('ru-RU').format(v) + ' ₸');
const TYPE: Record<string, { label: string; color: string; out?: boolean }> = {
  DEPOSIT: { label: 'Задаток', color: 'blue' },
  PAYMENT: { label: 'Оплата', color: 'green' },
  COMMISSION: { label: 'Комиссия', color: 'geekblue' },
  PAYOUT: { label: 'Выплата продавцу', color: 'purple', out: true },
  REFUND: { label: 'Возврат', color: 'red', out: true },
  EXPENSE: { label: 'Расход', color: 'volcano', out: true },
};
const METHOD: Record<string, string> = { CASH: 'Наличные', CARD: 'Карта', TRANSFER: 'Перевод', KASPI: 'Kaspi' };

export function CashboxPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    apiFetch('GET', '/payments').then(setData).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const create = async () => {
    const v = await form.validateFields();
    await apiFetch('POST', '/payments', v);
    message.success('Платёж проведён');
    setOpen(false);
    form.resetFields();
    load();
  };

  const s = data?.summary ?? {};

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Баланс кассы" value={s.balance ?? 0} suffix="₸" prefix={<WalletOutlined />} valueStyle={{ color: '#3B6EF2' }} groupSeparator=" " />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card>
            <Statistic title="Приход" value={s.totalIn ?? 0} suffix="₸" prefix={<ArrowUpOutlined />} valueStyle={{ color: '#12B76A' }} groupSeparator=" " />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card>
            <Statistic title="Расход" value={s.totalOut ?? 0} suffix="₸" prefix={<ArrowDownOutlined />} valueStyle={{ color: '#F04438' }} groupSeparator=" " />
          </Card>
        </Col>
      </Row>

      <Card title="Касса — движения" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Провести платёж</Button>}>
        <Table dataSource={data?.payments ?? []} rowKey="id" loading={loading} pagination={{ pageSize: 15 }}>
          <Table.Column dataIndex="createdAt" title="Дата" render={(v) => dayjs(v).format('DD.MM.YYYY HH:mm')} />
          <Table.Column dataIndex="type" title="Тип" render={(v) => <Tag color={TYPE[v]?.color}>{TYPE[v]?.label ?? v}</Tag>} />
          <Table.Column
            dataIndex="amount"
            title="Сумма"
            render={(v, r: any) => (
              <b style={{ color: TYPE[r.type]?.out ? '#F04438' : '#12B76A' }}>
                {TYPE[r.type]?.out ? '−' : '+'}{fmt(v)}
              </b>
            )}
          />
          <Table.Column dataIndex="method" title="Способ" render={(v) => METHOD[v] ?? v} />
          <Table.Column title="Сделка" render={(_, r: any) => r.deal?.title ?? '—'} ellipsis />
          <Table.Column title="Клиент" render={(_, r: any) => (r.client ? `${r.client.firstName} ${r.client.lastName ?? ''}` : '—')} />
        </Table>
      </Card>

      <Modal open={open} onOk={create} onCancel={() => setOpen(false)} title="Провести платёж" okText="Провести" cancelText="Отмена">
        <Form form={form} layout="vertical">
          <Form.Item name="amount" label="Сумма, ₸" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="type" label="Тип" initialValue="PAYMENT">
                <Select options={Object.entries(TYPE).map(([value, t]) => ({ value, label: t.label }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="method" label="Способ" initialValue="CASH">
                <Select options={Object.entries(METHOD).map(([value, label]) => ({ value, label }))} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
