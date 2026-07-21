import { Refine, Authenticated } from '@refinedev/core';
import {
  ThemedLayoutV2,
  ThemedTitleV2,
  ErrorComponent,
  useNotificationProvider,
} from '@refinedev/antd';
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import {
  HomeOutlined,
  ApartmentOutlined,
  TeamOutlined,
  FundProjectionScreenOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import '@refinedev/antd/dist/reset.css';

import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { PropertyList, PropertyCreate, PropertyEdit, PropertyShow } from './pages/properties';
import { ClientList, ClientCreate, ClientEdit, ClientShow } from './pages/clients';
import { DealList } from './pages/deals';
import { StaffList } from './pages/staff';

const Title = (props: any) => (
  <ThemedTitleV2 {...props} text="Nedviga.CRM" icon={<span style={{ fontSize: 20 }}>🏠</span>} />
);

export function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        routerProvider={routerBindings}
        notificationProvider={useNotificationProvider}
        resources={[
          { name: 'dashboard', list: '/', meta: { label: 'Обзор', icon: <HomeOutlined /> } },
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
          { name: 'staff', list: '/staff', meta: { label: 'Сотрудники', icon: <UsergroupAddOutlined /> } },
        ]}
        options={{ syncWithLocation: true, warnWhenUnsavedChanges: true }}
      >
        <Routes>
          <Route
            element={
              <Authenticated key="protected" fallback={<CatchAllNavigate to="/login" />}>
                <ThemedLayoutV2 Title={Title}>
                  <Outlet />
                </ThemedLayoutV2>
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
            <Route path="/staff" element={<StaffList />} />
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
