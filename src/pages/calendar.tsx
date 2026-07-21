import { useEffect, useMemo, useState } from 'react';
import { App, Badge, Button, Calendar, Card, Col, DatePicker, Form, Input, List, Modal, Row, Select, Typography } from 'antd';
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { apiFetch } from '../api';

const { Text } = Typography;
const TYPE: Record<string, string> = { MEETING: 'Встреча', VIEWING: 'Показ', CALL: 'Звонок', DEADLINE: 'Дедлайн', OTHER: 'Другое' };

export function CalendarPage() {
  const { message } = App.useApp();
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<Dayjs>(dayjs());
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => apiFetch<{ events: any[] }>('GET', '/events').then((r) => setEvents(r.events));
  useEffect(() => { load(); }, []);

  const byDay = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const e of events) {
      const k = dayjs(e.startAt).format('YYYY-MM-DD');
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(e);
    }
    return m;
  }, [events]);

  const dayEvents = byDay.get(selected.format('YYYY-MM-DD')) ?? [];

  const create = async () => {
    const v = await form.validateFields();
    const start = (v.time ?? selected).toISOString();
    await apiFetch('POST', '/events', { title: v.title, type: v.type, startAt: start, location: v.location });
    message.success('Событие добавлено');
    setOpen(false);
    form.resetFields();
    load();
  };

  return (
    <Row gutter={16}>
      <Col xs={24} lg={16}>
        <Card>
          <Calendar
            value={selected}
            onSelect={setSelected}
            cellRender={(date) => {
              const list = byDay.get(date.format('YYYY-MM-DD')) ?? [];
              return (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {list.slice(0, 2).map((e) => (
                    <li key={e.id}>
                      <Badge status="processing" text={<span style={{ fontSize: 11 }}>{e.title}</span>} />
                    </li>
                  ))}
                  {list.length > 2 && <li style={{ fontSize: 11, color: '#98A5B8' }}>+{list.length - 2}</li>}
                </ul>
              );
            }}
          />
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card
          title={selected.format('D MMMM')}
          extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Событие</Button>}
        >
          <List
            dataSource={dayEvents}
            locale={{ emptyText: 'Событий нет' }}
            renderItem={(e: any) => (
              <List.Item>
                <List.Item.Meta
                  title={`${dayjs(e.startAt).format('HH:mm')} · ${e.title}`}
                  description={
                    <Text type="secondary">
                      {TYPE[e.type]} {e.location ? <> · <EnvironmentOutlined /> {e.location}</> : null}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Modal open={open} onOk={create} onCancel={() => setOpen(false)} title="Новое событие" okText="Создать" cancelText="Отмена">
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input placeholder="Показ квартиры…" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="type" label="Тип" initialValue="MEETING">
                <Select options={Object.entries(TYPE).map(([value, label]) => ({ value, label }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="time" label="Время" initialValue={selected.hour(12).minute(0)}>
                <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="location" label="Место">
            <Input placeholder="Адрес…" />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
}
