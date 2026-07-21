import type { ThemeConfig } from 'antd';

export const nedvigaTheme: ThemeConfig = {
  token: {
    colorPrimary: '#3B6EF2',
    colorInfo: '#3B6EF2',
    colorSuccess: '#12B76A',
    colorWarning: '#F79009',
    colorError: '#F04438',
    borderRadius: 12,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgLayout: '#F6F8FC',
  },
  components: {
    Layout: { headerBg: '#ffffff', siderBg: '#ffffff', bodyBg: '#F6F8FC' },
    Menu: { itemSelectedBg: 'rgba(59,110,242,0.10)', itemSelectedColor: '#3B6EF2' },
    Card: { borderRadiusLG: 18 },
    Button: { controlHeight: 40, borderRadius: 12 },
  },
};
