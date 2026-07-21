import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { App, Button, Card, Col, Descriptions, Form, Input, InputNumber, Result, Row, Space, Statistic, Tag, Typography } from 'antd';
import {
  SafetyCertificateOutlined,
  CalculatorOutlined,
  ApiOutlined,
  WhatsAppOutlined,
  ArrowRightOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import svcMortgage from '../assets/svc-mortgage.png';
import svcRestr from '../assets/svc-restrictions.png';
import svcApi from '../assets/svc-api.png';
import svcWa from '../assets/svc-whatsapp.png';
import eco from '../assets/eco-banner.png';

const { Title, Text } = Typography;
const fmt = (v?: number | null) => (v == null ? '—' : new Intl.NumberFormat('ru-RU').format(Math.round(v)) + ' ₸');

const SERVICES = [
  { id: 'restrictions', title: 'Проверка ограничений', desc: 'Обременения и аресты по объекту', img: svcRestr },
  { id: 'mortgage', title: 'Ипотечный калькулятор', desc: 'Платёж, переплата, график', img: svcMortgage },
  { id: 'whatsapp', title: 'WhatsApp интеграция', desc: 'Переписка с клиентами в CRM', img: svcWa, badge: 'NEW' },
  { id: 'api', title: 'Партнёрское API', desc: 'Ключи, вебхуки, документация', img: svcApi },
];

export function ServicesPage() {
  const navigate = useNavigate();
  return (
    <div>
      <Row gutter={[16, 16]}>
        {SERVICES.map((s) => (
          <Col xs={24} sm={12} lg={8} key={s.id}>
            <Card hoverable onClick={() => navigate(`/services/${s.id}`)} style={{ height: '100%' }}>
              <Space align="start">
                <img src={s.img} alt="" style={{ width: 56, height: 56 }} />
                <div>
                  <Space>
                    <Text strong style={{ fontSize: 15 }}>{s.title}</Text>
                    {s.badge && <Tag color="green">{s.badge}</Tag>}
                  </Space>
                  <div style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>{s.desc}</div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        onClick={() => navigate('/services/ecosystem')}
        hoverable
        style={{ marginTop: 16, background: 'linear-gradient(135deg,#5A93FF,#3B6EF2)', border: 'none', overflow: 'hidden' }}
        bodyStyle={{ padding: 24, position: 'relative' }}
      >
        <img src={eco} alt="" style={{ position: 'absolute', right: -10, bottom: -20, width: 200, opacity: 0.9 }} />
        <div style={{ maxWidth: '70%' }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>Хотите стать частью экосистемы?</Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Партнёрам — API, лиды и совместные сделки.</Text>
          <div><Button style={{ marginTop: 14 }} icon={<ArrowRightOutlined />}>Оставить заявку</Button></div>
        </div>
      </Card>
    </div>
  );
}

export function ServiceDetailPage() {
  const { id } = useParams();
  if (id === 'mortgage') return <Mortgage />;
  if (id === 'restrictions') return <Restrictions />;
  if (id === 'api') return <PartnerApi />;
  if (id === 'ecosystem') return <Ecosystem />;
  if (id === 'whatsapp') return <Card title="WhatsApp интеграция"><Text>Раздел в разработке — скоро подключим переписку.</Text></Card>;
  return <Card><Text>Не найдено</Text></Card>;
}

function Mortgage() {
  const [price, setPrice] = useState(58000000);
  const [down, setDown] = useState(11600000);
  const [rate, setRate] = useState(18);
  const [years, setYears] = useState(20);
  const c = useMemo(() => {
    const P = Math.max(0, price - down);
    const r = rate / 100 / 12;
    const n = years * 12;
    const monthly = r > 0 ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n;
    const total = monthly * n;
    return { P, monthly, total, over: total - P };
  }, [price, down, rate, years]);

  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Card title="Ипотечный калькулятор">
          <Form layout="vertical">
            <Form.Item label="Стоимость объекта, ₸"><InputNumber style={{ width: '100%' }} value={price} onChange={(v) => setPrice(v ?? 0)} min={0} /></Form.Item>
            <Form.Item label="Первоначальный взнос, ₸"><InputNumber style={{ width: '100%' }} value={down} onChange={(v) => setDown(v ?? 0)} min={0} /></Form.Item>
            <Row gutter={12}>
              <Col span={12}><Form.Item label="Ставка, %"><InputNumber style={{ width: '100%' }} value={rate} onChange={(v) => setRate(v ?? 0)} min={0} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Срок, лет"><InputNumber style={{ width: '100%' }} value={years} onChange={(v) => setYears(v ?? 1)} min={1} /></Form.Item></Col>
            </Row>
          </Form>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{ background: 'linear-gradient(135deg,#5A93FF,#3B6EF2)', border: 'none', marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>Ежемесячный платёж</Text>
          <div style={{ color: '#fff', fontSize: 32, fontWeight: 800 }}>{fmt(c.monthly)}</div>
        </Card>
        <Card>
          <Descriptions column={1}>
            <Descriptions.Item label="Сумма кредита">{fmt(c.P)}</Descriptions.Item>
            <Descriptions.Item label="Переплата">{fmt(c.over)}</Descriptions.Item>
            <Descriptions.Item label="Итого выплат">{fmt(c.total)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
}

function Restrictions() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const check = () => {
    if (!q.trim()) return;
    setLoading(true);
    setRes(null);
    setTimeout(() => { setRes(q.length % 2 === 0); setLoading(false); }, 1000);
  };
  return (
    <Card title="Проверка ограничений" extra={<SafetyCertificateOutlined />}>
      <Space.Compact style={{ width: '100%', maxWidth: 520 }}>
        <Input placeholder="Кадастровый номер или адрес" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button type="primary" loading={loading} onClick={check}>Проверить</Button>
      </Space.Compact>
      {res !== null && (
        <div style={{ marginTop: 20 }}>
          <Result
            status={res ? 'success' : 'warning'}
            title={res ? 'Ограничений не найдено' : 'Найдены ограничения'}
            subTitle={res ? 'Объект свободен от обременений и арестов.' : 'Есть залог/арест — запросите выписку.'}
          />
        </div>
      )}
      <Text type="secondary">Демо-режим. Для боевой проверки нужна интеграция с гос. реестром (эГов).</Text>
    </Card>
  );
}

function PartnerApi() {
  const { message } = App.useApp();
  const [key, setKey] = useState('ndvg_live_8f2a…c91');
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Card title="API-ключ" extra={<ApiOutlined />}>
          <Space.Compact style={{ width: '100%' }}>
            <Input value={key} readOnly />
            <Button icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(key); message.success('Скопировано'); }} />
          </Space.Compact>
          <Button style={{ marginTop: 12 }} onClick={() => setKey('ndvg_live_' + Math.random().toString(16).slice(2, 8) + '…' + Math.floor(Math.random() * 900 + 100))}>
            Перевыпустить ключ
          </Button>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Эндпоинты">
          {['GET /v1/properties', 'POST /v1/leads', 'GET /v1/deals', 'POST /webhooks'].map((e) => (
            <div key={e} style={{ fontFamily: 'monospace', padding: '6px 0', color: '#64748B' }}>{e}</div>
          ))}
        </Card>
      </Col>
    </Row>
  );
}

function Ecosystem() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [sent, setSent] = useState(false);
  if (sent) return <Card><Result status="success" title="Спасибо!" subTitle="Мы свяжемся с вами в течение рабочего дня." /></Card>;
  return (
    <Card title="Стать партнёром" style={{ maxWidth: 560 }}>
      <Form form={form} layout="vertical" onFinish={() => { message.success('Заявка отправлена'); setSent(true); }}>
        <Form.Item name="company" label="Компания" rules={[{ required: true }]}><Input placeholder="ТОО «…»" /></Form.Item>
        <Form.Item name="name" label="Контактное лицо" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}><Input placeholder="+7 …" /></Form.Item>
        <Button type="primary" htmlType="submit">Оставить заявку</Button>
      </Form>
    </Card>
  );
}
