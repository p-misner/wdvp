import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import Hero from './components/Hero';
import { MultiCharts } from './components/Minicharts';
import { maxWidth } from './styleConstants';

const AllContent = styled.h1`
  margin: 0 auto;
  width: 95vw;
  max-width: ${maxWidth};
`;

function App() {
  const [theme, setTheme] = useState('presentWorld');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  useEffect(() => {
    fetch('presentDayAvgLatest.json')
      .then((response) => response.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  return (
    <AllContent>
      <Header />
      <Hero />
      {isLoading ? (
        <p> Loading...</p>
      ) : (
        <MultiCharts data={data} theme="presentWorld" />
      )}
    </AllContent>
  );
}

export default App;
