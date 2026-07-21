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
import { Table, Space, Tag, Form, Input, InputNumber, Select, Row, Col, Descriptions } from 'antd';

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
    <List headerButtons={<CreateButton>Добавить клиента</CreateButton>}>
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
    <Create saveButtonProps={saveButtonProps} title="Новый клиент">
      <Form {...formProps} layout="vertical">
        <Fields />
      </Form>
    </Create>
  );
}
export function ClientEdit() {
  const { formProps, saveButtonProps } = useForm({ resource: 'clients', action: 'edit' });
  return (
    <Edit saveButtonProps={saveButtonProps} title="Редактировать клиента">
      <Form {...formProps} layout="vertical">
        <Fields />
      </Form>
    </Edit>
  );
}
export function ClientShow() {
  const { queryResult } = useShow();
  const r: any = queryResult?.data?.data;
  return (
    <Show isLoading={queryResult?.isLoading} title={`${r?.firstName ?? ''} ${r?.lastName ?? ''}`}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Тип">{label(TYPE, r?.type)}</Descriptions.Item>
        <Descriptions.Item label="Статус">{label(STATUS, r?.status)}</Descriptions.Item>
        <Descriptions.Item label="Телефон">{r?.phone ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Email">{r?.email ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Бюджет">{fmt(r?.budgetMin)} — {fmt(r?.budgetMax)}</Descriptions.Item>
        <Descriptions.Item label="Источник">{r?.source ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Заметка" span={2}>{r?.note ?? '—'}</Descriptions.Item>
      </Descriptions>
    </Show>
  );
}
