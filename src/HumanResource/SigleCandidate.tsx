import React, { useState } from 'react';
import { Tabs, Card, List, Tag, Button, Modal } from 'antd';
import { BASEURL } from 'src/services/api/apiClient';

const { TabPane } = Tabs;

const SigleCandidate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [candidate] = useState({
    name: 'Mohd Danish',
    email: 'danish@mail.com',
    mobile: '9876543210',
    designation: 'Software Developer',
  });

  const documents = [
    { title: 'Offer Letter', status: 'PENDING' },
    { title: 'Employee Agreement', status: 'PENDING' },
    { title: 'HR Policies', status: 'COMPLETED' },
    { title: 'Checklist', status: 'PENDING' },
  ];
  console.log(selectedDoc);
  // Open modal
  const handleView = (doc) => {
    console.log(doc);
    const url = `${BASEURL}/checklist?name=${candidate.name}&designation=${candidate.designation}`;
    console.log(url);
    setSelectedDoc({ ...doc, url: url });
    setIsModalOpen(true);
  };

  // Send action (dummy for now)
  const handleSend = (doc) => {
    console.log('Send document:', doc);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <Card style={{ marginBottom: 20 }}>
        <h2>{candidate.name}</h2>
        <p>{candidate.email}</p>
        <p>{candidate.mobile}</p>
        <p>{candidate.designation}</p>
      </Card>

      {/* Tabs */}
      <Tabs defaultActiveKey="1">
        {/* Documents Tab */}
        <TabPane tab="Documents" key="1">
          <Card>
            <List
              dataSource={documents}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    item.status === 'COMPLETED' ? (
                      <Tag color="green">Completed</Tag>
                    ) : (
                      <Tag color="orange">Pending</Tag>
                    ),
                    <Button type="link" onClick={() => handleView(item)}>
                      View
                    </Button>,
                    <Button type="link" onClick={() => handleSend(item)}>
                      Send
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description="HR Document"
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        {/* Info Tab */}
        <TabPane tab="Details" key="2">
          <Card>
            <p>
              <b>Name:</b> {candidate.name}
            </p>
            <p>
              <b>Email:</b> {candidate.email}
            </p>
            <p>
              <b>Mobile:</b> {candidate.mobile}
            </p>
            <p>
              <b>Designation:</b> {candidate.designation}
            </p>
          </Card>
        </TabPane>

        {/* Actions Tab */}
        <TabPane tab="Actions" key="3">
          <Card>
            <button style={{ padding: 10, marginRight: 10 }}>
              Send Offer Letter
            </button>

            <button style={{ padding: 10 }}>Convert to Staff</button>
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal */}
      <Modal
        title={selectedDoc?.title}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
      >
        {selectedDoc && (
          <iframe
            src={selectedDoc.url}
            style={{
              width: '100%',
              height: '70vh',
              border: 'none',
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default SigleCandidate;
