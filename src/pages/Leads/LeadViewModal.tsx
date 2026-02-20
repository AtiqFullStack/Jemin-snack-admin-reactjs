import { Modal } from 'antd';
import { Lead } from '../../types/leads';

import HeaderTabs from './HeaderTabs';

interface LeadViewModalProps {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
}

const LeadViewModal = ({ open, lead, onClose }: LeadViewModalProps) => {
  if (!lead) return null;

  return (
    <Modal
      title="Lead Details"
      open={open}
      onCancel={onClose}
      footer={null}
      styles={{
        body: {
          maxHeight: '80vh',
          overflowY: 'auto',
        },
      }}
      style={{ top: 20 }} // optional: modal top se fix
      width={{
        xxl: '80%',
        xl: '90%',
        lg: '90%',
        md: '90%',
        sm: '90%',
        xs: '100%',
      }}
    >
      <HeaderTabs lead={lead} />
    </Modal>
  );
};

export default LeadViewModal;
