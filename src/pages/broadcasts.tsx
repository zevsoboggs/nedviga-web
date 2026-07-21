import { useEffect, useState } from 'react';
import { App, Button, Card, Form, Image, Input, List, Modal, Space, Tag } from 'antd';
import { PlusOutlined, PictureOutlined, SendOutlined } from '@ant-design/icons';
import { apiFetch } from '../api';

export function BroadcastList() {
  const { message } = App.useApp();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [genBusy, setGenBusy] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    apiFetch<{ broadcasts: any[] }>('GET', '/broadcasts').then((r) => setRows(r.broadcasts)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const genBanner = async () => {
    const title = form.getFieldValue('title') || 'Промо недвижимости в Казахстане';
    setGenBusy(true);
    try {
      const { dataUrl } = await apiFetch<{ dataUrl: string }>('POST', '/broadcasts/banner', { prompt: title, transparent: true });
      setBanner(dataUrl);
    } catch (e: any) {
      message.error(e?.message ?? 'Не удалось сгенерировать');
    } finally {
      setGenBusy(false);
    }
  };

  const create = async () => {
    const v = await form.validateFields();
    await apiFetch('POST', '/broadcasts', { ...v, bannerUrl: banner ?? undefined });
    message.success('Рассылка создана');
    setOpen(false);
    form.resetFields();
    setBanner(null);
    load();
  };

  const send = async (id: string) => {
    await apiFetch('POST', `/broadcasts/${id}/send`);
    message.success('Отправлено');
    load();
  };

  return (
    <Card title="Рассылки" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Новая</Button>}>
      <List
        loading={loading}
        dataSource={rows}
        locale={{ emptyText: 'Пока нет рассылок' }}
        renderItem={(b: any) => (
          <List.Item
            actions={[b.status !== 'SENT' ? <Button key="s" size="small" icon={<SendOutlined />} onClick={() => send(b.id)}>Отправить</Button> : null].filter(Boolean)}
          >
            <List.Item.Meta
              avatar={b.bannerUrl ? <Image src={b.bannerUrl} width={64} height={48} style={{ objectFit: 'contain' }} /> : undefined}
              title={<Space>{b.title}<Tag color={b.status === 'SENT' ? 'green' : 'default'}>{b.status === 'SENT' ? 'Отправлена' : 'Черновик'}</Tag></Space>}
              description={b.body}
            />
          </List.Item>
        )}
      />

      <Modal open={open} onOk={create} onCancel={() => setOpen(false)} title="Новая рассылка" okText="Создать" cancelText="Отмена" width={560}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Заголовок" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="body" label="Текст" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
          {banner && <Image src={banner} width="100%" height={160} style={{ objectFit: 'contain', marginBottom: 12 }} />}
          <Button icon={<PictureOutlined />} loading={genBusy} onClick={genBanner}>Сгенерировать баннер (AI)</Button>
        </Form>
      </Modal>
    </Card>
  );
}
