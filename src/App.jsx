import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Header, Footer } from './components/Header';
import Hero from './components/Hero';
import { PresentFutureDashboard } from './components/Minicharts';
import { maxWidth } from './styleConstants';
import { DataCard } from './components/DataCards';
import { LookBackChart } from './components/LookBackChart';

const Background = styled.div`
  background: linear-gradient(
    314.51deg,
    #35587a 29.1%,
    #569a85 37.86%,
    #89b6a2 50.09%,
    #93bca7 54.77%,
    #d6eac7 80.28%,
    #dae8c3 83.32%,
    #dee5be 88.05%
  );
  * {
    font-family: Inter;
  }
`;

const AllContent = styled.div`
  border-radius: 8px;
  margin: 0px auto;
  width: 95vw;
  max-width: ${maxWidth};
`;

function App() {
  const [theme, setTheme] = useState('presentWorld');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  // useEffect(() => {
  //   fetch('/presentDayAvgLatest.json')
  //     .then((response) => response.json())
  //     .then((d) => {
  //       setData(d);
  //       setLoading(false);
  //     });
  // }, []);
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/p-misner/wdvp/main/public/presentDayAvgLatest.json'
    )
      .then((response) => response.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  return (
    <Background>
      <AllContent>
        <Header />
        <Hero />
        <DataCard />
        {isLoading ? (
          <p> Loading...</p>
        ) : (
          <PresentFutureDashboard data={data} theme="presentWorld" />
        )}
      </AllContent>
      {/* <LookBackChart /> */}

      <AllContent>
        <Footer />
      </AllContent>
    </Background>
  );
}

export default App;
