import { useAuth } from '../../hooks';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../components';
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import HrDashBoard from 'src/components/dashboard/HrDashBoard';
import SalesDashBoard from 'src/components/dashboard/SalesDashBoard';
import Administration from 'src/components/dashboard/Administration';
import TelecallerDashboard from 'src/components/dashboard/TelecallerDashboard';

export const DefaultDashboardPage = () => {
  const { user } = useAuth();
  const roleType = user?.roleId?.roleType;

  const renderDashboard = () => {
    switch (roleType) {
      case 'hr':
        return <HrDashBoard />;
      case 'admin':
        return <Administration />;
      case 'administration':
        return <Administration />;
      case 'telecaller':
        return <TelecallerDashboard />;
      default:
        return <SalesDashBoard />;
    }
  };

  return (
    <div>
      <Helmet>
        <title>CRM Dashboard | Jemini</title>
      </Helmet>

      <PageHeader
        title=""
        breadcrumbs={[
          {
            title: (
              <>
                <HomeOutlined /> home
              </>
            ),
          },
          {
            title: (
              <>
                <AppstoreOutlined /> crm
              </>
            ),
          },
          { title: 'dashboard' },
        ]}
      />

      {renderDashboard()}
    </div>
  );
};
