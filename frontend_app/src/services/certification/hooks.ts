import { useState, useEffect } from 'react';
import { xorBy } from 'lodash-es';
import { useAuth } from 'services/auth';
import { getComments, addNewComment } from './';
import { CertComment } from './types';

export const useComment = (
  certificationId: string,
  callbacks: {
    onInitialMessageLoad?: (c: CertComment[]) => void;
    onNewComments?: (c: CertComment[]) => void;
  }
) => {
  const [comments, setComments] = useState<CertComment[]>([]);

  useEffect(() => {
    if (callbacks.onInitialMessageLoad) {
      getComments(certificationId).then(callbacks.onInitialMessageLoad);
    }
  }, []);

  useEffect(() => {
    const timerId = setTimeout(async () => {
      const c: CertComment[] = await getComments(certificationId);
      if (callbacks.onNewComments) {
        callbacks.onNewComments(xorBy(c, comments, '_id'));
      }
      setComments(c);
    }, parseInt(process.env.COM_POLL as string) || 60000);

    return () => clearTimeout(timerId);
  });

  const addComment = (c: string) => addNewComment(certificationId, c);

  return { comments, addComment };
};
