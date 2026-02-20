import { Col, Flex, Typography } from 'antd';
import { Logo } from '../shared';
import { STRINGS } from '../../assets';

const AuthLeft = () => {
  const { Title, Text } = Typography;
  return (
    <>
      <Col xs={24} lg={12}>
        <Flex
          vertical
          align="center"
          justify="center"
          className="text-center"
          style={{
            backgroundImage: `url(https://as2.ftcdn.net/v2/jpg/02/58/86/97/1000_F_258869730_KSydnAki0M5lBLRthoTtCfIxkwhA5VzF.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            padding: '1rem',
          }}
        >
          <Logo color="white" />
          <Title
            level={2}
            className="text-white"
            
            style={{ marginTop: '1rem' }}
          >
            Welcome back to {STRINGS.PROJECT.NAME}
            
          </Title>
          <Text className="text-white" style={{ fontSize: 18 }}>
            A dynamic and versatile multipurpose dashboard utilizing Ant Design,
            React, TypeScript, and Vite.
          </Text>
        </Flex>
      </Col>
    </>
  );
};

export default AuthLeft;
