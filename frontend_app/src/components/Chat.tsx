import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useComment } from 'services/certification/hooks';
import { useAuth } from 'services/auth';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import { CertComment } from 'services/certification/types';

const ChatStyles = createGlobalStyle`
  .rcw-launcher {
    background-color: #1890ff;
  }

  .rcw-conversation-container .rcw-header {
    background-color: #f4f7f9;
    padding: 0px 0 20px;
  }

  .rcw-title {
    display: none;
  }

  .rcw-response .rcw-message-text {
    background-color: #f4f7f9;
    border-radius: 10px;
    padding: 8px;
  }

  .rcw-client .rcw-message-text {
    background-color: #0081ff;
    border-radius: 10px;
    padding: 8px;
    color: white;
  }
`;

interface IChat {
  className?: string;
}

const Chat: React.FC<IChat> = ({ className }) => {
  const { user } = useAuth();

  const onInitialMessageLoad = (comments: CertComment[]) => {
    comments.forEach((c) => {
      if (c.author === user?.name) {
        addUserMessage(c.comment, c._id);
      } else {
        addResponseMessage(c.comment, c._id);
      }
    });
  };

  const onNewComments = (comments: CertComment[]) => {
    comments.forEach((c) => {
      if (c.author !== user?.name) {
        addResponseMessage(c.comment, c._id);
      }
    });
  };

  const { addComment } = useComment('b62bf652-03d5-ea11-a813-000d3a563622', {
    onInitialMessageLoad,
    onNewComments,
  });

  const handleNewUserMessage = (comment: string) => {
    addComment(comment);
  };

  return (
    <React.Fragment>
      <Widget handleNewUserMessage={handleNewUserMessage} title="" subtitle="" />
      <ChatStyles />
    </React.Fragment>
  );
};

export default Chat;
