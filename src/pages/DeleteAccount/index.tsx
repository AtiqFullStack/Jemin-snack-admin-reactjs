import React from 'react';

const DeleteAccount = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Delete Your Account</h1>

        <p style={styles.text}>
          If you would like to delete your Jemini CRM account, please follow the
          instructions below.
        </p>

        <h3 style={styles.heading}>How to request account deletion:</h3>
        <ul style={styles.list}>
          <li>Send an email to our support team</li>
          <li>Use your registered email address</li>
          <li>
            Include the subject: <b>“Delete My Account”</b>
          </li>
        </ul>

        <p style={styles.text}>
          📧 Support Email:{' '}
          <a href="mailto:jeminisnacks@gmail.com">jeminisnacks@gmail.com</a>
        </p>

        <h3 style={styles.heading}>What happens next?</h3>
        <ul style={styles.list}>
          <li>Your request will be reviewed within 48 hours</li>
          <li>All your personal data will be permanently deleted</li>
          <li>This action cannot be undone</li>
        </ul>

        <p style={styles.warning}>
          ⚠️ Once your account is deleted, you will lose access to all your data
          including leads, tasks, and activities.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f5f5',
  },
  card: {
    background: '#fff',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '600px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '10px',
  },
  heading: {
    marginTop: '20px',
  },
  text: {
    marginTop: '10px',
    lineHeight: '1.6',
  },
  list: {
    marginTop: '10px',
    paddingLeft: '20px',
  },
  warning: {
    marginTop: '20px',
    color: 'red',
    fontWeight: 'bold',
  },
};

export default DeleteAccount;
