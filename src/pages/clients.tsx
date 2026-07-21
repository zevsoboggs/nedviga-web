import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  Create,
  Edit,
  Show,
  useForm,
} from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import { Avatar, Card, Table, Space, Tag, Form, Input, InputNumber, Select, Row, Col, Divider } from 'antd';
import { PhoneOutlined, MailOutlined, WalletOutlined, ImportOutlined } from '@ant-design/icons';

const fmt = (v?: number | null) => (v == null ? '—' : new Intl.NumberFormat('ru-RU').format(v) + ' ₸');
const TYPE = [
  { value: 'BUYER', label: 'Покупатель' },
  { value: 'SELLER', label: 'Продавец' },
  { value: 'TENANT', label: 'Арендатор' },
  { value: 'LANDLORD', label: 'Арендодатель' },
  { value: 'OTHER', label: 'Другое' },
];
const STATUS = [
  { value: 'NEW', label: 'Новый', color: 'blue' },
  { value: 'IN_PROGRESS', label: 'В работе', color: 'gold' },
  { value: 'NEGOTIATION', label: 'Переговоры', color: 'orange' },
  { value: 'WON', label: 'Успех', color: 'green' },
  { value: 'LOST', label: 'Отказ', color: 'red' },
];
const label = (arr: { value: string; label: string }[], v: string) => arr.find((x) => x.value === v)?.label ?? v;

export function ClientList() {
  const { tableProps } = useTable({ resource: 'clients', pagination: { mode: 'client', pageSize: 10 } });
  return (
    <List breadcrumb={false} headerButtons={<CreateButton>Добавить клиента</CreateButton>}>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="Имя" render={(_, r: any) => `${r.firstName} ${r.lastName ?? ''}`} />
        <Table.Column dataIndex="type" title="Тип" render={(v) => label(TYPE, v)} />
        <Table.Column dataIndex="phone" title="Телефон" />
        <Table.Column dataIndex="budgetMax" title="Бюджет до" render={(v) => fmt(v)} />
        <Table.Column
          dataIndex="status"
          title="Статус"
          render={(v) => {
            const s = STATUS.find((x) => x.value === v);
            return <Tag color={s?.color}>{s?.label ?? v}</Tag>;
          }}
        />
        <Table.Column
          title="Действия"
          render={(_, r: any) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={r.id} />
              <EditButton hideText size="small" recordItemId={r.id} />
              <DeleteButton hideText size="small" recordItemId={r.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

function Fields() {
  return (
    <>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label="Имя" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Фамилия" name="lastName">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label="Тип" name="type" initialValue="BUYER">
            <Select options={TYPE} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Статус" name="status" initialValue="NEW">
            <Select options={STATUS} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label="Телефон" name="phone">
            <Input placeholder="+7 …" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={8}>
          <Form.Item label="Бюджет от" name="budgetMin">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Бюджет до" name="budgetMax">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Источник" name="source">
            <Input placeholder="krisha.kz…" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Заметка" name="note">
        <Input.TextArea rows={3} />
      </Form.Item>
    </>
  );
}

export function ClientCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: 'clients', action: 'create' });
  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={false} title="Новый клиент">
      <Form {...formProps} layout="vertical">
        <Fields />
      </Form>
    </Create>
  );
}
export function ClientEdit() {
  const { formProps, saveButtonProps } = useForm({ resource: 'clients', action: 'edit' });
  return (
    <Edit saveButtonProps={saveButtonProps} breadcrumb={false} title="Редактировать клиента">
      <Form {...formProps} layout="vertical">
        <Fields />
      </Form>
    </Edit>
  );
}
export function ClientShow() {
  const { queryResult } = useShow();
  const r: any = queryResult?.data?.data;
  const st = STATUS.find((x) => x.value === r?.status);
  const name = `${r?.firstName ?? ''} ${r?.lastName ?? ''}`.trim();
  const rows = [
    { icon: <PhoneOutlined />, label: 'Телефон', value: r?.phone ?? '—' },
    { icon: <MailOutlined />, label: 'Email', value: r?.email ?? '—' },
    { icon: <ImportOutlined />, label: 'Источник', value: r?.source ?? '—' },
    { icon: <WalletOutlined />, label: 'Бюджет', value: r?.budgetMin || r?.budgetMax ? `${fmt(r?.budgetMin)} — ${fmt(r?.budgetMax)}` : '—' },
  ];
  return (
    <Show breadcrumb={false} isLoading={queryResult?.isLoading} title={name}>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar size={84} style={{ background: '#3B6EF2', fontSize: 32 }}>{r?.firstName?.[0]}</Avatar>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 12 }}>{name}</div>
            <Space style={{ marginTop: 8 }} wrap>
              <Tag color={st?.color}>{st?.label ?? r?.status}</Tag>
              <Tag>{label(TYPE, r?.type)}</Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Контакты и бюджет">
            {rows.map((it, i) => (
              <div key={it.label}>
                <Row align="middle" style={{ padding: '10px 0' }}>
                  <Col flex="34px" style={{ color: '#3B6EF2' }}>{it.icon}</Col>
                  <Col flex="120px" style={{ color: '#98A5B8' }}>{it.label}</Col>
                  <Col flex="auto" style={{ fontWeight: 600 }}>{it.value}</Col>
                </Row>
                {i < rows.length - 1 && <Divider style={{ margin: 0 }} />}
              </div>
            ))}
          </Card>
          {r?.note ? (
            <Card title="Заметка" style={{ marginTop: 16 }}>
              <div style={{ whiteSpace: 'pre-wrap', color: '#3f4a5c', lineHeight: 1.6 }}>{r.note}</div>
            </Card>
          ) : null}
        </Col>
      </Row>
    </Show>
  );
}
