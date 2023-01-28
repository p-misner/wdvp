import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import Hero from './components/Hero';
import ExploreSections from './components/ExploreSections';
import { PastDecadeSection, MultiCharts } from './components/Minicharts';
import { maxWidth } from './styleConstants';

const AllContent = styled.h1`
  margin: 0 auto;
  max-width: ${maxWidth};
`;

function App() {
  const [theme, setTheme] = useState('presentWorld');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();

  function sectionReturn(item) {
    switch (item) {
      case 'presentWorld':
        return <MultiCharts data={data} theme={item} />;
      case 'pastDecade':
        return <PastDecadeSection />;
      case 'countryCompare':
        return <MultiCharts data={data} theme={item} />;
      default:
        return <p>Something went wrong</p>;
    }
  }
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
      <ExploreSections theme={theme} setTheme={setTheme} />
      {isLoading ? <p> Loading...</p> : sectionReturn(theme)}
    </AllContent>
  );
}

export default App;
