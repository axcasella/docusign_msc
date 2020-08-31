import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import { useAuth } from 'services/auth';
import { UserRole } from 'services/auth/auth.service';

interface AddEvaluationProps {
  onsubmit: (evaluation: { evidence: string; comment: string }) => void;
}

const AddEvaluation: React.FC<AddEvaluationProps> = ({ onsubmit }) => {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    onsubmit({ evidence, comment });
    setEvidence('');
    setComment('');
  };

  if (user?.role !== UserRole.CB) return <></>;

  return (
    <>
      <Form.Item>
        <Input placeholder="Evidence Name" onChange={(e) => setEvidence(e.target.value)} value={evidence} />
      </Form.Item>
      <Form.Item>
        <Input.TextArea
          placeholder="Comments..."
          rows={4}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
      </Form.Item>
      <Form.Item>
        <Button size={'small'} htmlType="submit" onClick={handleSubmit} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  );
};

export default AddEvaluation;
