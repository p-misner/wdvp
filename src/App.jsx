import React from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import Hero from './components/Hero';
import { maxWidth } from './styleConstants';

const AllContent = styled.h1`
  margin: 0 auto;
  max-width: ${maxWidth};
`;

function App() {
  return (
    <AllContent>
      <Header />
      <Hero />
    </AllContent>
  );
}

export default App;
