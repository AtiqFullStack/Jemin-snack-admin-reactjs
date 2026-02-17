import { Layout, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
const { Text } = Typography;

type FooterNavProps = React.HTMLAttributes<HTMLDivElement>;

const FooterNav = ({ ...others }: FooterNavProps) => {
  return (
    <Footer
      {...others}
      style={{
        textAlign: 'center',
        padding: '20px 16px',
      }}
    >
      <Space direction="vertical" size={4}>
        <Text>
          © {new Date().getFullYear()} <strong>Jemini CRM</strong>. All rights
          reserved.
        </Text>

        <Space size="middle">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <a href="mailto:support@jeminicrm.com">support@jeminicrm.com</a>
        </Space>
      </Space>
    </Footer>
  );
};

export default FooterNav;
