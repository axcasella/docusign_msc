import React from 'react';
import styled from 'styled-components';


const Zoomlink = styled(({ link, ...rest }) => (
  <a href={link} target="_blank" {...rest}>
    {link}
  </a>
))`
  display: inline-block;
  padding: 10px 16px;
  background-color: #f2f6fa;
  border-radius: 8px;
  /* border: 1px dashed #b9b9b9; */
  box-shadow: 0px 2px 1px 0px rgb(0 0 0 / 10%);
  margin-right: 8px;

  && {
    color: rgba(0, 0, 0, 0.65);
  }
  font-weight: bold;
  font-family: monospace;
  font-size: 1.5em;

  cursor: pointer;
`;

export default Zoomlink;
