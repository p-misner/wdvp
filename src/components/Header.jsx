import React from 'react';
import styled from 'styled-components';
import {
  boldWeight,
  fontColor,
  medFontSize,
  medSpacing,
  regularWeight,
} from '../styleConstants';

const HeaderWrapper = styled.div`
  border: 1px solid ${fontColor};
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: space-between;
  padding: ${medSpacing};
`;

const AppTitle = styled.h2`
  font-size: ${medFontSize};
  font-weight: ${boldWeight};
`;
const NavigationWrapper = styled.div``;
const NavLink = styled.h3`
  font-size: ${medFontSize};
  font-weight: ${regularWeight};
`;

function Header() {
  return (
    <HeaderWrapper>
      <AppTitle>Dashboard of the Present Future</AppTitle>
      <NavigationWrapper>
        <NavLink>About</NavLink>
      </NavigationWrapper>
    </HeaderWrapper>
  );
}
export default Header;
