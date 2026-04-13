import { useEffect, useState } from 'react';
import { Tabs, Card, List, Tag, Button, Modal, Spin, Descriptions } from 'antd';
import { BASEURL } from 'src/services/api/apiClient';
import candidateService from 'src/services/candidateService';
import { useParams } from 'react-router-dom';

const { TabPane } = Tabs;

const SigleCandidate = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { getById } = candidateService();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  console.log('hii');
  console.log(candidateId);
  useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }
    getById(candidateId)
      .then((res: any) => {
        if (res?.success) setCandidate(res.data);
        else setCandidate(res?.data || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [candidateId]);

  const documents = [
    { title: 'Offer Letter', status: 'PENDING' },
    { title: 'Employee Agreement', status: 'PENDING' },
    { title: 'HR Policies', status: 'COMPLETED' },
    { title: 'Checklist', status: 'PENDING' },
  ];

  const handleView = (doc: any) => {
    console.log(doc);
    const name = candidate?.name || '';
    const designation = candidate?.designation || '';
    let type = doc.title;
    let end =
      type == 'Offer Letter'
        ? 'offer-letter'
        : type == 'Employee Agreement'
          ? 'agreement'
          : type == 'HR Policies'
            ? 'hr-policies'
            : 'checklist';
    console.log(end);
    const url = `${BASEURL}/${end}?name=${encodeURIComponent(
      name
    )}&designation=${encodeURIComponent(designation)}`;
    setSelectedDoc({ ...doc, url });
    setIsModalOpen(true);
  };

  if (loading) return <Spin style={{ display: 'block', marginTop: 80 }} />;
  if (!candidate) return <div style={{ padding: 20 }}>Candidate not found</div>;

  return (
    <div style={{ padding: 20 }}>
      <Card style={{ marginBottom: 20 }}>
        <h2>{candidate.name}</h2>
        <p>{candidate.email}</p>
        <p>{candidate.mobile || candidate.phone}</p>
        <p>{candidate.designation}</p>
      </Card>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Documents" key="1">
          <Card>
            <List
              dataSource={documents}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    // item.status === 'COMPLETED'
                    //   ? <Tag color="green">Completed</Tag>
                    //   : <Tag color="orange">Pending</Tag>,
                    <Button type="link" onClick={() => handleView(item)}>
                      View
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

        <TabPane tab="Details" key="2">
          <Card>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Name">
                {candidate.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {candidate.email}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {candidate.mobile || candidate.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Designation">
                {candidate.designation}
              </Descriptions.Item>
              {candidate.department && (
                <Descriptions.Item label="Department">
                  {candidate.department}
                </Descriptions.Item>
              )}
              {candidate.status && (
                <Descriptions.Item label="Status">
                  <Tag>{candidate.status}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab="Actions" key="3">
          <Card>
            <Button type="primary" style={{ marginRight: 10 }}>
              Send Offer Letter
            </Button>
            <Button>Convert to Staff</Button>
          </Card>
        </TabPane>
      </Tabs>

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
            style={{ width: '100%', height: '75vh', border: 'none' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default SigleCandidate;
