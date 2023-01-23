import React, { useState } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import Hero from './components/Hero';
import ExploreSections from './components/ExploreSections';
import { maxWidth } from './styleConstants';

const AllContent = styled.h1`
  margin: 0 auto;
  max-width: ${maxWidth};
`;

function App() {
  const [theme, setTheme] = useState('presentWorld'); // options: presentWorld, pastDecade, countryCompare

  return (
    <AllContent>
      <Header />
      <Hero />
      <ExploreSections theme={theme} setTheme={setTheme} />
    </AllContent>
  );
}

export default App;
