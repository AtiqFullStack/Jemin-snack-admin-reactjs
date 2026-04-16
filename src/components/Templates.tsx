import { useRef, useState } from 'react';
import { List, Modal, Button } from 'antd';

const Templates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleOpen = () => setIsModalOpen(true);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow!.document;
      doc.designMode = 'on';
    } catch (err) {
      console.log('❌ Cross Origin Issue', err);
    }
  };

  const handleSave = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const html = iframe.contentDocument!.documentElement.outerHTML;
      console.log('FULL HTML:', html);
      alert('Content saved in console ✅');
    } catch (err) {
      console.log('❌ Cannot access iframe', err);
    }
  };

  return (
    <>
      <List
        dataSource={[{ title: 'Offer Letter' }]}
        renderItem={(item) => (
          <List.Item onClick={handleOpen} style={{ cursor: 'pointer' }}>
            {item.title}
          </List.Item>
        )}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={1000}
        footer={[
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <iframe
          ref={iframeRef}
          src={'https://crm.jeminisnacks.com/backend/offer-letter'}
          onLoad={handleIframeLoad}
          style={{
            width: '100%',
            height: '80vh',
            border: '1px solid #ccc',
          }}
        />
      </Modal>
    </>
  );
};

export default Templates;
