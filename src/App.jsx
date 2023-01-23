import React, { useState } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import Hero from './components/Hero';
import ExploreSections from './components/ExploreSections';
import {
  CountryCompareSection,
  PresentWorldSection,
  PastDecadeSection,
} from './components/Minicharts';
import { maxWidth } from './styleConstants';

const AllContent = styled.h1`
  margin: 0 auto;
  max-width: ${maxWidth};
`;
function sectionReturn(item) {
  switch (item) {
    case 'presentWorld':
      return <PresentWorldSection />;
    case 'pastDecade':
      return <PastDecadeSection />;
    case 'countryCompare':
      return <CountryCompareSection />;
    default:
      return <p>Something went wrong</p>;
  }
}

function App() {
  const [theme, setTheme] = useState('presentWorld');
  return (
    <AllContent>
      <Header />
      <Hero />
      <ExploreSections theme={theme} setTheme={setTheme} />
      {sectionReturn(theme)}
    </AllContent>
  );
}

export default App;
