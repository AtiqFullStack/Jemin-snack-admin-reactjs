import React from 'react';
import { Modal } from 'antd';

interface ImageModalProps {
  imageUrl: string;
  isModalOpen: boolean;
  onClose: () => void;
  title?: any;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  isModalOpen,
  onClose,
  title,
}) => {
  return (
    <Modal
      title={title}
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      bodyStyle={{
        height: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <img
        src={imageUrl}
        alt="Preview"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain', // 🔥 keeps ratio
          borderRadius: 8,
        }}
      />
    </Modal>
  );
};

export default ImageModal;
