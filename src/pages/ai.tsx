import { useRef, useState } from 'react';
import { Avatar, Button, Card, Input, Space, Spin, Typography } from 'antd';
import { SendOutlined, RobotOutlined } from '@ant-design/icons';
import hero from '../assets/ai-hero.png';
import { apiFetch } from '../api';

const { Text, Title } = Typography;

interface Msg { role: 'user' | 'assistant'; content: string }
const SUGGESTIONS = [
  'Составь объявление для 2-комн. в Алматы',
  'Посчитай комиссию 3% от 58 млн ₸',
  'Что ответить клиенту, который торгуется?',
];

export function AiPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [convId, setConvId] = useState<string | undefined>();
  const endRef = useRef<HTMLDivElement>(null);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setBusy(true);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 40);
    try {
      const res = await apiFetch<{ conversationId: string; message: { content: string } }>('POST', '/ai/chat', {
        conversationId: convId,
        message: msg,
      });
      setConvId(res.conversationId);
      setMessages((m) => [...m, { role: 'assistant', content: res.message.content }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', content: `⚠️ ${e?.message ?? 'AI недоступен'}` }]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  };

  return (
    <Card style={{ height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto', paddingTop: 20 }}>
            <img src={hero} alt="AI" style={{ width: 140, height: 140 }} />
            <Title level={4} style={{ marginTop: 8 }}>Nedviga AI</Title>
            <Text type="secondary">Составлю объявление, найду клиента, посчитаю комиссию и ипотеку.</Text>
            <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
              {SUGGESTIONS.map((s) => (
                <Button key={s} block onClick={() => send(s)} style={{ textAlign: 'left', height: 'auto', padding: '10px 14px' }}>
                  {s}
                </Button>
              ))}
            </Space>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
              {m.role === 'assistant' && <Avatar icon={<RobotOutlined />} style={{ background: '#3B6EF2', marginRight: 8, flexShrink: 0 }} />}
              <div
                style={{
                  maxWidth: '72%',
                  padding: '10px 14px',
                  borderRadius: 16,
                  background: m.role === 'user' ? '#3B6EF2' : '#F1F5FB',
                  color: m.role === 'user' ? '#fff' : '#111A2B',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {busy && <Spin style={{ display: 'block', margin: '8px auto' }} />}
        <div ref={endRef} />
      </div>

      <Space.Compact style={{ width: '100%', marginTop: 12 }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={() => send()}
          placeholder="Спросите что-нибудь…"
          size="large"
        />
        <Button type="primary" size="large" icon={<SendOutlined />} onClick={() => send()} loading={busy} />
      </Space.Compact>
    </Card>
  );
}
