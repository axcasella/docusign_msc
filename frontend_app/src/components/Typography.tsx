import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';

const _SectionHeading = (props: TitleProps) => <Typography.Title level={4} {...props} />;

export const SectionHeading = styled(_SectionHeading)`
  && {
    margin: 0em 0 1em 0;
  }
`;
