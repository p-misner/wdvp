import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  lrgSpacing,
  medFontSize,
  regSpacing,
  semiboldWeight,
} from '../styleConstants';

const Overline = styled.p`
  text-transform: uppercase;
  margin-top: ${lrgSpacing};
`;

const ExploreWrapper = styled.div`
  max-width: 750px;
  margin: 0 auto 100px auto;
  & div:nth-child(2) {
    border-top: 1px solid black;
  }
`;

const SectionRow = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid black;
  background-color: ${(props) => (props.match ? 'gray' : 'none')};
  &:hover {
    background-color: lightgray;
  }
`;

const SectionTitle = styled.h6`
  font-size: ${medFontSize};
  font-weight: ${semiboldWeight};
  margin: ${regSpacing};
`;

function Section({ theme, cat, onClick }) {
  return (
    <SectionRow onClick={() => onClick()} match={cat === theme}>
      <SectionTitle> {cat} and</SectionTitle>
    </SectionRow>
  );
}

Section.propTypes = {
  theme: PropTypes.oneOf(['presentWorld', 'pastDecade', 'countryCompare'])
    .isRequired,
  cat: PropTypes.oneOf(['presentWorld', 'pastDecade', 'countryCompare'])
    .isRequired,
  onClick: PropTypes.func.isRequired,
};

function ExploreSections({ theme, setTheme }) {
  return (
    <ExploreWrapper>
      <Overline> I&apos;m interested in exploring...</Overline>
      <Section
        cat="pastDecade"
        onClick={() => setTheme('pastDecade')}
        theme={theme}
      />
      <Section
        cat="presentWorld"
        onClick={() => setTheme('presentWorld')}
        theme={theme}
      />
      <Section
        cat="countryCompare"
        onClick={() => setTheme('countryCompare')}
        theme={theme}
      />
    </ExploreWrapper>
  );
}

ExploreSections.propTypes = {
  theme: PropTypes.oneOf(['presentWorld', 'pastDecade', 'countryCompare'])
    .isRequired,
  setTheme: PropTypes.func.isRequired,
};

export default ExploreSections;
