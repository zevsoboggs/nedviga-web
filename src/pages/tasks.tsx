import { useEffect, useState } from 'react';
import { App, Button, Card, Checkbox, DatePicker, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { apiFetch } from '../api';

const PRIO: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Низкий', color: 'default' },
  MEDIUM: { label: 'Средний', color: 'blue' },
  HIGH: { label: 'Высокий', color: 'gold' },
  URGENT: { label: 'Срочный', color: 'red' },
};

export function TaskList() {
  const { message } = App.useApp();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    apiFetch<{ tasks: any[] }>('GET', '/tasks').then((r) => setRows(r.tasks)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggle = async (t: any) => {
    await apiFetch('PATCH', `/tasks/${t.id}`, { status: t.status === 'DONE' ? 'TODO' : 'DONE' });
    load();
  };

  const create = async () => {
    const v = await form.validateFields();
    await apiFetch('POST', '/tasks', { ...v, dueAt: v.dueAt ? v.dueAt.toISOString() : undefined });
    message.success('Задача создана');
    setOpen(false);
    form.resetFields();
    load();
  };

  return (
    <Card
      title="Задачи"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Добавить</Button>}
    >
      <Table dataSource={rows} rowKey="id" loading={loading} pagination={{ pageSize: 12 }}>
        <Table.Column
          title=""
          width={40}
          render={(_, t: any) => <Checkbox checked={t.status === 'DONE'} onChange={() => toggle(t)} />}
        />
        <Table.Column
          title="Задача"
          render={(_, t: any) => (
            <span style={{ textDecoration: t.status === 'DONE' ? 'line-through' : 'none', opacity: t.status === 'DONE' ? 0.5 : 1 }}>
              {t.title}
            </span>
          )}
        />
        <Table.Column dataIndex="priority" title="Приоритет" render={(v) => <Tag color={PRIO[v]?.color}>{PRIO[v]?.label ?? v}</Tag>} />
        <Table.Column dataIndex="dueAt" title="Срок" render={(v) => (v ? dayjs(v).format('DD.MM.YYYY') : '—')} />
      </Table>

      <Modal open={open} onOk={create} onCancel={() => setOpen(false)} title="Новая задача" okText="Создать" cancelText="Отмена">
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input placeholder="Позвонить клиенту…" />
          </Form.Item>
          <Space>
            <Form.Item name="priority" label="Приоритет" initialValue="MEDIUM">
              <Select style={{ width: 160 }} options={Object.entries(PRIO).map(([value, p]) => ({ value, label: p.label }))} />
            </Form.Item>
            <Form.Item name="dueAt" label="Срок">
              <DatePicker format="DD.MM.YYYY" />
            </Form.Item>
          </Space>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
