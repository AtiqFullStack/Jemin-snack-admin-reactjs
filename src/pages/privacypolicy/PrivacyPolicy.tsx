import { Card, Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicy = () => {
  const updatedDate = '5/14/2026';
  const year = new Date().getFullYear();

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Typography>
          <Title level={2}>Privacy Policy</Title>

          <Paragraph>
            <Text type="secondary">Last updated: {updatedDate}</Text>
          </Paragraph>

          <Divider />

          <Title level={3}>1. Information We Collect</Title>
          <Paragraph>
            Jemini CRM collects information necessary to provide customer
            relationship management services:
          </Paragraph>

          <ul>
            <li>
              <strong>Account Information:</strong> Name, email address, phone
              number, company details, and login credentials
            </li>
            <li>
              <strong>Lead & Customer Data:</strong> Contact information,
              interaction history, sales records, and customer management data
            </li>
            <li>
              <strong>Usage Data:</strong> System logs, app activity, device
              information, and performance metrics
            </li>
            <li>
              <strong>Communication Data:</strong> Emails, messages, call
              records, and notifications within the CRM platform
            </li>
            <li>
              <strong>Location Data:</strong> Jemini CRM may collect device
              location (foreground and background with permission) for:
              <ul>
                <li>Employee attendance tracking</li>
                <li>Field staff monitoring</li>
                <li>Delivery or service verification</li>
                <li>Route and visit management</li>
                <li>Live tracking and reporting</li>
              </ul>
              Location access is used only with user permission and can be
              disabled anytime via device settings.
            </li>
          </ul>

          <Divider />

          <Title level={3}>2. How We Use Your Information</Title>
          <ul>
            <li>Provide and maintain CRM services</li>
            <li>Manage leads, customers, employees, and sales pipelines</li>
            <li>Enable attendance and live location tracking features</li>
            <li>Generate reports and analytics</li>
            <li>Send notifications and updates</li>
            <li>Improve system performance and user experience</li>
            <li>Ensure security and prevent fraud</li>
            <li>Monitor field operations and assigned tasks</li>
          </ul>

          <Divider />

          <Title level={3}>3. Location Data Usage</Title>
          <Paragraph>
            Location data may be collected in foreground and background only
            when required for business operations such as attendance, field
            tracking, and delivery verification. we will not collect location
            when user clockout.
          </Paragraph>

          <Divider />

          <Title level={3}>4. Data Storage & Security</Title>
          <ul>
            <li>Encrypted data transmission (SSL/TLS)</li>
            <li>Secure database storage</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
            <li>Automated backups</li>
          </ul>

          <Divider />

          <Title level={3}>5. Data Sharing</Title>
          <ul>
            <li>With your explicit consent</li>
            <li>With authorized team members within your organization</li>
            <li>With trusted service providers</li>
            <li>When required by law</li>
            <li>
              <strong>Location data is never sold to third parties</strong>
            </li>
          </ul>

          <Divider />

          <Title level={3}>6. Your Rights</Title>
          <ul>
            <li>Access your data</li>
            <li>Correct information</li>
            <li>Delete data</li>
            <li>Export data</li>
            <li>Opt-out of communication</li>
            <li>Withdraw consent</li>
            <li>Disable location permissions</li>
          </ul>

          <Divider />

          <Title level={3}>7. Cookies & Tracking</Title>
          <Paragraph>
            We use cookies to improve experience, analytics, and security.
          </Paragraph>

          <Divider />

          <Title level={3}>8. Data Retention</Title>
          <Paragraph>
            Data is retained as long as account is active or required by law.
            Location records may be stored temporarily for attendance and
            operational tracking.
          </Paragraph>

          <Divider />

          <Title level={3}>9. Third-Party Services</Title>
          <Paragraph>
            We may use third-party services like email, analytics, maps, and
            cloud providers.
          </Paragraph>

          <Divider />

          <Title level={3}>10. Children's Privacy</Title>
          <Paragraph>
            Our services are not intended for users under 18 years of age.
          </Paragraph>

          <Divider />

          <Title level={3}>11. Changes to Policy</Title>
          <Paragraph>
            We may update this policy anytime. Continued use means acceptance of
            changes.
          </Paragraph>

          <Divider />

          <Title level={3}>12. Contact Us</Title>
          <Paragraph>
            Email: privacy@Jeminicrm.com <br />
            Phone: +1 (555) 123-4567 <br />
            Address:Pink City Snacks Industries, Building no. 9, Dher Ka Bala ji
            Railway Station Jothwara Jaipur, Rajasthan
          </Paragraph>

          <Divider />

          <Paragraph style={{ textAlign: 'center' }} type="secondary">
            © {year} Jemini CRM. All rights reserved.
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
