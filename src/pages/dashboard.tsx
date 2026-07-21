import { useEffect, useState } from 'react';
import { useGetIdentity } from '@refinedev/core';
import { Card, Col, Row, Statistic, Typography, Spin, List, Tag } from 'antd';
import {
  TeamOutlined,
  ApartmentOutlined,
  FundOutlined,
  CheckSquareOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { apiFetch } from '../api';

const { Title, Text } = Typography;
const fmt = (v?: number | null) => (v == null ? '—' : new Intl.NumberFormat('ru-RU').format(v) + ' ₸');

export function Dashboard() {
  const { data: identity } = useGetIdentity<any>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('GET', '/overview')
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;

  const m = data?.metrics ?? {};
  const tiles = [
    { title: 'Клиенты', value: m.clients, icon: <TeamOutlined /> },
    { title: 'Объекты', value: m.activeProperties, icon: <ApartmentOutlined /> },
    { title: 'Сделки', value: m.openDeals, icon: <FundOutlined /> },
    { title: 'Задачи', value: m.openTasks, icon: <CheckSquareOutlined /> },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Здравствуйте, {identity?.name ?? ''} 👋
      </Title>
      <Text type="secondary">{identity?.agency}</Text>

      <Card
        style={{ margin: '20px 0', background: 'linear-gradient(135deg,#5A93FF,#3B6EF2)', border: 'none' }}
        bodyStyle={{ padding: 24 }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
          <DollarOutlined /> Комиссия закрытых сделок
        </Text>
        <div style={{ color: '#fff', fontSize: 34, fontWeight: 800, marginTop: 6 }}>{fmt(m.wonCommission)}</div>
        <Tag color="rgba(255,255,255,0.25)" style={{ color: '#fff', border: 'none', marginTop: 8 }}>
          {m.wonCount ?? 0} успешных
        </Tag>
      </Card>

      <Row gutter={[16, 16]}>
        {tiles.map((t) => (
          <Col xs={12} md={6} key={t.title}>
            <Card>
              <Statistic title={t.title} value={t.value ?? 0} prefix={t.icon} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Ближайшие события">
            <List
              dataSource={data?.upcomingEvents ?? []}
              locale={{ emptyText: 'Событий нет' }}
              renderItem={(e: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={e.title}
                    description={new Date(e.startAt).toLocaleString('ru-RU')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Воронка">
            <List
              dataSource={data?.pipeline ?? []}
              locale={{ emptyText: 'Нет данных' }}
              renderItem={(p: any) => (
                <List.Item actions={[<b key="c">{p._count}</b>]}>
                  <List.Item.Meta title={p.stage} description={fmt(p._sum?.amount)} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
