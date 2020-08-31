import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

type SimpleMenuProps = {};
interface SimpleMenuItemProps {
  icon?: React.ReactNode;
}

interface SimpleMenuType extends React.FC<SimpleMenuProps> {
  Item?: any;
}

export const SimpleMenu: SimpleMenuType = styled(({ className, children }) => (
  <ul className={className}>{children}</ul>
))`
  list-style: none;
  padding: 0;
`;

const Item = styled(({ children, icon, linkto, ...rest }) => {
  const history = useHistory();
  const onLinkClick = () => linkto && history.push(linkto);
  return (
    <li onClick={onLinkClick} {...rest}>
      <span>{icon}</span>
      {children}
    </li>
  );
})`
  cursor: pointer;
  margin-bottom: 12px;
  margin-left: -5px;
  padding: 5px 10px;
  border-radius: 4px;
  :hover {
    background-color: #efefef;
    color: #2f2f2f;
  }
  > span {
    margin-right: 12px;
  }
`;

SimpleMenu.Item = Item;
