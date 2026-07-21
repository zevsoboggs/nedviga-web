import { useState } from 'react';
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
import { App, Button, Table, Space, Tag, Form, Input, InputNumber, Modal, Select, Row, Col, Descriptions, Image, Upload } from 'antd';
import { DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiFetch } from '../api';
const fmt = (v?: number | null) => (v == null ? '—' : new Intl.NumberFormat('ru-RU').format(v) + ' ₸');

const TYPE = [
  { value: 'APARTMENT', label: 'Квартира' },
  { value: 'HOUSE', label: 'Дом' },
  { value: 'COMMERCIAL', label: 'Коммерция' },
  { value: 'LAND', label: 'Земля' },
  { value: 'GARAGE', label: 'Гараж' },
  { value: 'ROOM', label: 'Комната' },
];
const DEAL = [
  { value: 'SALE', label: 'Продажа' },
  { value: 'RENT', label: 'Аренда' },
  { value: 'RENT_DAILY', label: 'Посуточно' },
];
const STATUS = [
  { value: 'ACTIVE', label: 'В продаже', color: 'green' },
  { value: 'RESERVED', label: 'Бронь', color: 'gold' },
  { value: 'SOLD', label: 'Продан', color: 'default' },
  { value: 'RENTED', label: 'Сдан', color: 'default' },
  { value: 'DRAFT', label: 'Черновик', color: 'default' },
  { value: 'ARCHIVED', label: 'Архив', color: 'default' },
];
const label = (arr: { value: string; label: string }[], v: string) => arr.find((x) => x.value === v)?.label ?? v;

export function PropertyList() {
  const { tableProps, tableQueryResult } = useTable({ resource: 'properties', pagination: { mode: 'client', pageSize: 10 } });
  const { message } = App.useApp();
  const [importOpen, setImportOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const doImport = async () => {
    if (!url.trim()) return;
    setBusy(true);
    try {
      await apiFetch('POST', '/properties/import', { url: url.trim() });
      message.success('Объект импортирован');
      setImportOpen(false);
      setUrl('');
      tableQueryResult?.refetch();
    } catch (e: any) {
      message.error(e?.message ?? 'Не удалось импортировать');
    } finally {
      setBusy(false);
    }
  };

  return (
    <List
      headerButtons={
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => setImportOpen(true)}>Импорт с krisha.kz</Button>
          <CreateButton>Добавить объект</CreateButton>
        </Space>
      }
    >
      <Modal open={importOpen} onOk={doImport} confirmLoading={busy} onCancel={() => setImportOpen(false)} title="Импорт объекта с krisha.kz" okText="Импортировать" cancelText="Отмена">
        <p style={{ color: '#64748B' }}>Вставьте ссылку на объявление — цена, площадь, этаж, район и фото подтянутся автоматически.</p>
        <Input placeholder="https://krisha.kz/a/show/..." value={url} onChange={(e) => setUrl(e.target.value)} onPressEnter={doImport} />
      </Modal>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="Название" ellipsis />
        <Table.Column dataIndex="type" title="Тип" render={(v) => label(TYPE, v)} />
        <Table.Column dataIndex="dealKind" title="Сделка" render={(v) => label(DEAL, v)} />
        <Table.Column dataIndex="price" title="Цена" render={(v) => <b>{fmt(v)}</b>} />
        <Table.Column dataIndex="city" title="Город" />
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
      <Form.Item label="Название" name="title" rules={[{ required: true }]}>
        <Input placeholder="2-комн. ЖК «Есентай»" />
      </Form.Item>
      <Row gutter={12}>
        <Col span={8}>
          <Form.Item label="Тип" name="type" initialValue="APARTMENT">
            <Select options={TYPE} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Сделка" name="dealKind" initialValue="SALE">
            <Select options={DEAL} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Статус" name="status" initialValue="ACTIVE">
            <Select options={STATUS} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={8}>
          <Form.Item label="Цена, ₸" name="price">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Площадь, м²" name="area">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Комнат" name="rooms">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label="Город" name="city">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Район" name="district">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Адрес" name="address">
        <Input />
      </Form.Item>
      <Form.Item label="Описание" name="description">
        <Input.TextArea rows={3} />
      </Form.Item>
    </>
  );
}

export function PropertyCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: 'properties', action: 'create' });
  return (
    <Create saveButtonProps={saveButtonProps} title="Новый объект">
      <Form {...formProps} layout="vertical">
        <Fields />
      </Form>
    </Create>
  );
}

export function PropertyEdit() {
  const { formProps, saveButtonProps } = useForm({ resource: 'properties', action: 'edit' });
  return (
    <Edit saveButtonProps={saveButtonProps} title="Редактировать объект">
      <Form {...formProps} layout="vertical">
        <Fields />
      </Form>
    </Edit>
  );
}

export function PropertyShow() {
  const { queryResult } = useShow();
  const { message } = App.useApp();
  const r: any = queryResult?.data?.data;
  const [uploading, setUploading] = useState(false);

  const addPhotos = () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.multiple = true;
    inp.onchange = async () => {
      const files = Array.from(inp.files ?? []);
      if (!files.length) return;
      setUploading(true);
      try {
        const dataUrls = await Promise.all(
          files.slice(0, 8).map(
            (f) => new Promise<string>((res, rej) => { const rd = new FileReader(); rd.onload = () => res(String(rd.result)); rd.onerror = rej; rd.readAsDataURL(f); }),
          ),
        );
        await apiFetch('PATCH', `/properties/${r.id}`, { photos: [...(r.photos ?? []), ...dataUrls].slice(0, 12) });
        message.success('Фото добавлены');
        queryResult?.refetch();
      } finally {
        setUploading(false);
      }
    };
    inp.click();
  };

  const removePhoto = async (idx: number) => {
    await apiFetch('PATCH', `/properties/${r.id}`, { photos: (r.photos ?? []).filter((_: any, i: number) => i !== idx) });
    queryResult?.refetch();
  };

  return (
    <Show isLoading={queryResult?.isLoading} title={r?.title}>
      <Space wrap style={{ marginBottom: 16 }}>
        <Image.PreviewGroup>
          {(r?.photos ?? []).map((u: string, i: number) => (
            <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
              <Image src={u} width={160} height={120} style={{ objectFit: 'cover', borderRadius: 8 }} />
              <Button
                size="small"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                style={{ position: 'absolute', top: 4, right: 4 }}
                onClick={() => removePhoto(i)}
              />
            </div>
          ))}
        </Image.PreviewGroup>
        <Button
          onClick={addPhotos}
          loading={uploading}
          icon={<PlusOutlined />}
          style={{ width: 160, height: 120, borderStyle: 'dashed' }}
        >
          Фото
        </Button>
      </Space>
      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Цена">{fmt(r?.price)}</Descriptions.Item>
        <Descriptions.Item label="Тип">{label(TYPE, r?.type)}</Descriptions.Item>
        <Descriptions.Item label="Сделка">{label(DEAL, r?.dealKind)}</Descriptions.Item>
        <Descriptions.Item label="Статус">{label(STATUS, r?.status)}</Descriptions.Item>
        <Descriptions.Item label="Площадь">{r?.area ? r.area + ' м²' : '—'}</Descriptions.Item>
        <Descriptions.Item label="Комнат">{r?.rooms ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Этаж">{r?.floor ? `${r.floor}/${r.totalFloors ?? '?'}` : '—'}</Descriptions.Item>
        <Descriptions.Item label="Город">{r?.city ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Район">{r?.district ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Адрес" span={2}>{r?.address ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Описание" span={2}>{r?.description ?? '—'}</Descriptions.Item>
      </Descriptions>
    </Show>
  );
}
