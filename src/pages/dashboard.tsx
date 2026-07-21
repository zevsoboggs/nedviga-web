import { useEffect, useState } from 'react';
import { useGetIdentity } from '@refinedev/core';
import { Card, Carousel, Col, List, Row, Spin, Tag, Typography } from 'antd';
import {
  TeamOutlined,
  ApartmentOutlined,
  FundOutlined,
  CheckSquareOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { apiFetch } from '../api';
import slideAnalytics from '../assets/web-slide-analytics.png';
import slideDeals from '../assets/web-slide-deals.png';
import slideCity from '../assets/web-slide-city.png';

const { Title, Text } = Typography;
const fmt = (v?: number | null) => (v == null ? '—' : new Intl.NumberFormat('ru-RU').format(v) + ' ₸');
const STAGE: Record<string, string> = {
  LEAD: 'Заявка', QUALIFIED: 'Квалиф.', VIEWING: 'Показ', OFFER: 'Оферта', CONTRACT: 'Договор', CLOSED_WON: 'Успех', CLOSED_LOST: 'Отказ',
};
const COLORS = ['#3B6EF2', '#2E90FA', '#12B76A', '#F79009', '#7A5AF8', '#16B364', '#F04438'];

const SLIDES = [
  { img: slideAnalytics, title: 'Аналитика в реальном времени', sub: 'Метрики, воронка и касса на одном экране', colors: ['#5A93FF', '#3B6EF2'] },
  { img: slideDeals, title: 'Сделки под контролем', sub: 'От заявки до успешного закрытия', colors: ['#12B76A', '#059669'] },
  { img: slideCity, title: 'Вся недвижимость Казахстана', sub: 'Импорт с krisha.kz в одно касание', colors: ['#7A5AF8', '#5B3FE0'] },
];

export function Dashboard() {
  const { data: identity } = useGetIdentity<any>();
  const [data, setData] = useState<any>(null);
  const [cash, setCash] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('GET', '/overview').then(setData),
      apiFetch('GET', '/payments').then(setCash).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;

  const m = data?.metrics ?? {};
  const pipeline = (data?.pipeline ?? []).map((p: any) => ({ stage: STAGE[p.stage] ?? p.stage, count: p._count, amount: p._sum?.amount ?? 0 }));
  const tiles = [
    { title: 'Клиенты', value: m.clients, icon: <TeamOutlined />, color: '#3B6EF2' },
    { title: 'Объекты', value: m.activeProperties, icon: <ApartmentOutlined />, color: '#12B76A' },
    { title: 'Сделки', value: m.openDeals, icon: <FundOutlined />, color: '#F79009' },
    { title: 'Задачи', value: m.openTasks, icon: <CheckSquareOutlined />, color: '#7A5AF8' },
  ];

  return (
    <div>
      {/* Слайдер */}
      <Carousel autoplay autoplaySpeed={4500} style={{ marginBottom: 20, borderRadius: 20, overflow: 'hidden' }}>
        {SLIDES.map((s) => (
          <div key={s.title}>
            <div style={{ position: 'relative', height: 190, background: `linear-gradient(120deg, ${s.colors[0]}, ${s.colors[1]})`, borderRadius: 20, overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 40px' }}>
              <img src={s.img} alt="" style={{ position: 'absolute', right: 20, bottom: -20, height: 220, opacity: 0.95 }} />
              <div style={{ maxWidth: '60%' }}>
                <div style={{ color: '#fff', fontSize: 26, fontWeight: 800 }}>{s.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 6 }}>{s.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <Title level={4} style={{ marginBottom: 2 }}>Здравствуйте, {identity?.name ?? ''} 👋</Title>
      <Text type="secondary">{identity?.agency}</Text>

      {/* Метрики */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {tiles.map((t) => (
          <Col xs={12} md={6} key={t.title}>
            <Card bodyStyle={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: t.color + '18', color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{t.icon}</div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 12 }}>{t.value ?? 0}</div>
              <Text type="secondary">{t.title}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Финансы */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card style={{ background: 'linear-gradient(135deg,#5A93FF,#3B6EF2)', border: 'none', height: '100%' }} bodyStyle={{ padding: 24 }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}><DollarOutlined /> Комиссия закрытых сделок</Text>
            <div style={{ color: '#fff', fontSize: 34, fontWeight: 800, marginTop: 6 }}>{fmt(m.wonCommission)}</div>
            <Tag color="rgba(255,255,255,0.25)" style={{ color: '#fff', border: 'none', marginTop: 8 }}>{m.wonCount ?? 0} успешных</Tag>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ background: 'linear-gradient(135deg,#12B76A,#059669)', border: 'none', height: '100%' }} bodyStyle={{ padding: 24 }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}><RiseOutlined /> Баланс кассы</Text>
            <div style={{ color: '#fff', fontSize: 34, fontWeight: 800, marginTop: 6 }}>{fmt(cash?.summary?.balance)}</div>
            <Tag color="rgba(255,255,255,0.25)" style={{ color: '#fff', border: 'none', marginTop: 8 }}>{cash?.summary?.count ?? 0} операций</Tag>
          </Card>
        </Col>
      </Row>

      {/* Аналитика */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="Воронка сделок">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={pipeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any, n: any) => (n === 'amount' ? fmt(v) : v)} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {pipeline.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Сделки по стадиям">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pipeline.filter((p: any) => p.count > 0)} dataKey="count" nameKey="stage" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {pipeline.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* События + активность */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Ближайшие события">
            <List
              dataSource={data?.upcomingEvents ?? []}
              locale={{ emptyText: 'Событий нет' }}
              renderItem={(e: any) => (
                <List.Item><List.Item.Meta title={e.title} description={new Date(e.startAt).toLocaleString('ru-RU')} /></List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Активность">
            <List
              dataSource={data?.recentActivity ?? []}
              locale={{ emptyText: 'Нет действий' }}
              renderItem={(a: any) => (
                <List.Item><List.Item.Meta title={`${a.user?.firstName ?? 'Система'} · ${a.action}`} description={`${a.entityType} · ${new Date(a.createdAt).toLocaleString('ru-RU')}`} /></List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
