import { useEffect, useState, type ReactNode } from 'react';
import { useMenu, useGetIdentity, useLogout } from '@refinedev/core';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Dropdown, Menu, Tooltip, Typography } from 'antd';
import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import logo from '../assets/logo.png';
import { apiFetch } from '../api';

const { Text } = Typography;

export function Layout({ children }: { children: ReactNode }) {
  const { menuItems, selectedKey } = useMenu();
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<any>();
  const { mutate: logout } = useLogout();
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    apiFetch<{ unread: number }>('GET', '/notifications')
      .then((r) => setUnread(r.unread ?? 0))
      .catch(() => {});
  }, []);

  const items = menuItems.map((i: any) => ({ key: i.key, icon: i.icon, label: i.label }));
  const current: any = menuItems.find((m: any) => m.key === selectedKey);

  const W = collapsed ? 84 : 256;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: 16, gap: 16 }}>
      {/* Sidebar — плавающий, скруглённый, с отступами */}
      <aside
        className="nv-glass-card"
        style={{
          width: W,
          borderRadius: 22,
          position: 'sticky',
          top: 16,
          height: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width .2s ease',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '18px 0' : '18px 20px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <img src={logo} alt="Nedviga" style={{ width: 40, height: 40 }} />
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#111A2B', lineHeight: 1 }}>Nedviga</div>
              <div style={{ fontSize: 11, color: '#98A5B8' }}>CRM недвижимости</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[selectedKey]}
            items={items}
            style={{ border: 'none', background: 'transparent', padding: '0 10px' }}
            onClick={({ key }) => {
              const it: any = menuItems.find((m: any) => m.key === key);
              if (it?.route) navigate(it.route);
            }}
          />
        </div>

        <div style={{ borderTop: '1px solid rgba(16,27,45,0.06)', padding: collapsed ? 10 : '12px 14px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10 }}>
          <Avatar src={identity?.avatar} icon={<UserOutlined />} style={{ background: '#3B6EF2' }} />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{identity?.name ?? '—'}</div>
              <div style={{ fontSize: 11, color: '#98A5B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{identity?.agency ?? ''}</div>
            </div>
          )}
        </div>
      </aside>

      {/* Основная колонка */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
        {/* Header — плавающий */}
        <header
          className="nv-glass-card"
          style={{ borderRadius: 20, height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((v) => !v)}
          />
          <Text strong style={{ fontSize: 18, flex: 1 }}>
            {current?.label ?? 'Обзор'}
          </Text>

          <Tooltip title="Уведомления">
            <Badge count={unread} size="small">
              <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18 }} />} onClick={() => navigate('/notifications')} />
            </Badge>
          </Tooltip>

          <Dropdown
            menu={{
              items: [
                { key: 'role', label: identity?.role ?? '', disabled: true },
                { type: 'divider' },
                { key: 'settings', icon: <SettingOutlined />, label: 'Настройки', onClick: () => navigate('/settings') },
                { key: 'logout', icon: <LogoutOutlined />, label: 'Выйти', danger: true, onClick: () => logout() },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" style={{ height: 44, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar src={identity?.avatar} icon={<UserOutlined />} size={30} style={{ background: '#3B6EF2' }} />
              <span style={{ fontWeight: 600 }}>{(identity?.name ?? '').split(' ')[0]}</span>
            </Button>
          </Dropdown>
        </header>

        {/* Контент */}
        <section style={{ flex: 1, paddingBottom: 8 }}>{children}</section>
      </main>
    </div>
  );
}
