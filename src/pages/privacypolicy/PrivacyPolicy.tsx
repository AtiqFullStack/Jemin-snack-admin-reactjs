import { Card, Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Typography>
          <Title level={2}>Privacy Policy</Title>
          <Paragraph>
            <Text type="secondary">
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </Paragraph>

          <Divider />

          <Title level={3}>1. Information We Collect</Title>
          <Paragraph>
            Jemin CRM collects information necessary to provide customer
            relationship management services:
          </Paragraph>
          <Paragraph>
            <ul>
              <li>
                <strong>Account Information:</strong> Name, email, phone number,
                and company details
              </li>
              <li>
                <strong>Lead & Customer Data:</strong> Contact information,
                interaction history, and sales data
              </li>
              <li>
                <strong>Usage Data:</strong> System logs, activity tracking, and
                performance metrics
              </li>
              <li>
                <strong>Communication Data:</strong> Emails, messages, and call
                records within the CRM
              </li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={3}>2. How We Use Your Information</Title>
          <Paragraph>We use collected information to:</Paragraph>
          <Paragraph>
            <ul>
              <li>Provide and maintain CRM services</li>
              <li>Manage leads, customers, and sales pipelines</li>
              <li>Generate reports and analytics</li>
              <li>Send notifications and updates</li>
              <li>Improve system performance and user experience</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={3}>3. Data Storage & Security</Title>
          <Paragraph>
            Your data is stored securely using industry-standard encryption and
            security measures. We implement:
          </Paragraph>
          <Paragraph>
            <ul>
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure database storage</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Automated backups</li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={3}>4. Data Sharing</Title>
          <Paragraph>
            We do not sell your personal information. Data may be shared only:
          </Paragraph>
          <Paragraph>
            <ul>
              <li>With your explicit consent</li>
              <li>With team members within your organization</li>
              <li>With service providers who assist in operations</li>
              <li>When required by law or legal process</li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={3}>5. Your Rights</Title>
          <Paragraph>You have the right to:</Paragraph>
          <Paragraph>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request data deletion</li>
              <li>Export your data</li>
              <li>Opt-out of communications</li>
              <li>Withdraw consent</li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={3}>6. Cookies & Tracking</Title>
          <Paragraph>
            We use cookies and similar technologies to enhance user experience,
            analyze usage patterns, and maintain session security. You can
            control cookie preferences through your browser settings.
          </Paragraph>

          <Divider />

          <Title level={3}>7. Data Retention</Title>
          <Paragraph>
            We retain your data as long as your account is active or as needed
            to provide services. Data may be retained longer if required by law
            or for legitimate business purposes.
          </Paragraph>

          <Divider />

          <Title level={3}>8. Third-Party Services</Title>
          <Paragraph>
            Jemin CRM may integrate with third-party services (email providers,
            analytics tools, etc.). These services have their own privacy
            policies, and we encourage you to review them.
          </Paragraph>

          <Divider />

          <Title level={3}>9. Children's Privacy</Title>
          <Paragraph>
            Our services are not intended for individuals under 18 years of age.
            We do not knowingly collect personal information from children.
          </Paragraph>

          <Divider />

          <Title level={3}>10. Changes to Privacy Policy</Title>
          <Paragraph>
            We may update this privacy policy periodically. Significant changes
            will be communicated via email or system notifications. Continued
            use of services constitutes acceptance of updates.
          </Paragraph>

          <Divider />

          <Title level={3}>11. Contact Us</Title>
          <Paragraph>
            For privacy-related questions or concerns, contact us at:
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> privacy@jemincrm.com
            <br />
            <strong>Phone:</strong> +1 (555) 123-4567
            <br />
            <strong>Address:</strong> Jemin CRM, 123 Business Street, Suite 100,
            City, State 12345
          </Paragraph>

          <Divider />

          <Paragraph
            type="secondary"
            style={{ marginTop: '32px', textAlign: 'center' }}
          >
            © {new Date().getFullYear()} Jemin CRM. All rights reserved.
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
