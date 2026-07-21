import { Refine, Authenticated } from '@refinedev/core';
import { ErrorComponent, useNotificationProvider } from '@refinedev/antd';
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  ApartmentOutlined,
  TeamOutlined,
  FundProjectionScreenOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  RobotOutlined,
  AppstoreOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { Layout } from './components/Layout';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { PropertyList, PropertyCreate, PropertyEdit, PropertyShow } from './pages/properties';
import { ClientList, ClientCreate, ClientEdit, ClientShow } from './pages/clients';
import { DealList } from './pages/deals';
import { StaffList } from './pages/staff';
import { TaskList } from './pages/tasks';
import { CalendarPage } from './pages/calendar';
import { AiPage } from './pages/ai';
import { ServicesPage, ServiceDetailPage } from './pages/services';
import { BroadcastList } from './pages/broadcasts';
import { NotificationsPage } from './pages/notifications';
import { SettingsPage } from './pages/settings';

export function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        routerProvider={routerBindings}
        notificationProvider={useNotificationProvider}
        resources={[
          { name: 'dashboard', list: '/', meta: { label: 'Обзор', icon: <DashboardOutlined /> } },
          {
            name: 'properties',
            list: '/properties',
            create: '/properties/create',
            edit: '/properties/edit/:id',
            show: '/properties/show/:id',
            meta: { label: 'Объекты', icon: <ApartmentOutlined /> },
          },
          {
            name: 'clients',
            list: '/clients',
            create: '/clients/create',
            edit: '/clients/edit/:id',
            show: '/clients/show/:id',
            meta: { label: 'Клиенты', icon: <TeamOutlined /> },
          },
          { name: 'deals', list: '/deals', meta: { label: 'Сделки', icon: <FundProjectionScreenOutlined /> } },
          { name: 'tasks', list: '/tasks', meta: { label: 'Задачи', icon: <CheckSquareOutlined /> } },
          { name: 'calendar', list: '/calendar', meta: { label: 'Календарь', icon: <CalendarOutlined /> } },
          { name: 'ai', list: '/ai', meta: { label: 'AI-ассистент', icon: <RobotOutlined /> } },
          { name: 'services', list: '/services', meta: { label: 'Сервисы', icon: <AppstoreOutlined /> } },
          { name: 'broadcasts', list: '/broadcasts', meta: { label: 'Рассылки', icon: <NotificationOutlined /> } },
          { name: 'staff', list: '/staff', meta: { label: 'Сотрудники', icon: <UsergroupAddOutlined /> } },
        ]}
        options={{ syncWithLocation: true, warnWhenUnsavedChanges: true }}
      >
        <Routes>
          <Route
            element={
              <Authenticated key="protected" fallback={<CatchAllNavigate to="/login" />}>
                <Layout>
                  <Outlet />
                </Layout>
              </Authenticated>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/properties">
              <Route index element={<PropertyList />} />
              <Route path="create" element={<PropertyCreate />} />
              <Route path="edit/:id" element={<PropertyEdit />} />
              <Route path="show/:id" element={<PropertyShow />} />
            </Route>
            <Route path="/clients">
              <Route index element={<ClientList />} />
              <Route path="create" element={<ClientCreate />} />
              <Route path="edit/:id" element={<ClientEdit />} />
              <Route path="show/:id" element={<ClientShow />} />
            </Route>
            <Route path="/deals" element={<DealList />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/ai" element={<AiPage />} />
            <Route path="/services">
              <Route index element={<ServicesPage />} />
              <Route path=":id" element={<ServiceDetailPage />} />
            </Route>
            <Route path="/broadcasts" element={<BroadcastList />} />
            <Route path="/staff" element={<StaffList />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<ErrorComponent />} />
          </Route>

          <Route
            element={
              <Authenticated key="auth-pages" fallback={<Outlet />}>
                <NavigateToResource resource="dashboard" />
              </Authenticated>
            }
          >
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>

        <UnsavedChangesNotifier />
        <DocumentTitleHandler />
      </Refine>
    </BrowserRouter>
  );
}
