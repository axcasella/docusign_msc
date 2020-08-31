import React from 'react';
import { Typography, Button } from 'antd';
import TimelineControl from './TimelineControl';
import { CertificationStep } from 'store/certification/types';
import { Evaluation, AddEvaluation } from 'components/evaluation';
import { useEvaluations } from 'store/certification/hooks';
import { GoogleOutlined } from '@ant-design/icons';
import { UserRole } from 'services/auth/auth.service';
import { useAuth } from 'services/auth';

const FOLDER_ID = '19pnNCAn-xFSfa6zRbQXOfoQKYyDPZ3mk';

const Observations = () => {
  const { user } = useAuth();
  const { evaluations, postEvaluation } = useEvaluations();

  return (
    <>
      <Typography.Title level={3}>Observations</Typography.Title>
      <Button
        icon={<GoogleOutlined />}
        onClick={() => window.open(`https://drive.google.com/drive/u/1/folders/${FOLDER_ID}`, '_blank')}
      >
        Upload to google drive
      </Button>
      <iframe
        title="evidences"
        src={`https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}`}
        style={{ width: '100%', height: '250px', border: 0 }}
      ></iframe>

      {user && user.role !== UserRole.APPLICANT && (
        <>
          {evaluations &&
            evaluations.map((ev) => (
              <Evaluation
                key={ev.fsc_evaluationid}
                username={'sdaf'}
                article={ev.fsc_name}
                comment={ev.fsc_comment}
                date={ev.modifiedon}
              />
            ))}
          <AddEvaluation onsubmit={({ evidence, comment }) => postEvaluation(evidence, comment)} />
        </>
      )}
      <TimelineControl step={CertificationStep.OBSERVATIONS} />
    </>
  );
};

export default Observations;
