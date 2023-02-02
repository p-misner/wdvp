import React, { useState, useEffect } from 'react';
import { scaleLinear, scaleOrdinal } from '@visx/scale';

import {
  Aqua,
  Carrot,
  Marigold,
  Squash,
  regFontSize,
  DarkestBlue,
  DarkTeal,
  SeafoamGreen,
  Melon,
  PaleBlue,
  PaleGreen,
} from '../styleConstants';

export function tickFormatter(value) {
  if (value > 1000000) {
    return `${Math.round(value / 1000000)}M`;
  }
  if (value > 1000) {
    return `${value / 1000}k`;
  }
  return value;
}
export function contourColor({ xMetric, customMetric }) {
  const colorMatch = {
    'Weak Positive': PaleGreen,
    'Strong Positive': Aqua,
    Perfect: Aqua,
    'Weak Negative': Melon,
    'Strong Negative': Squash,
    No: PaleBlue,
  };
  let color;
  switch (xMetric) {
    case 'avgGDPpercapita':
      color = customMetric?.GDPcorrelation
        ? colorMatch[customMetric.GDPcorrelation]
        : 'black';
      break;
    case 'latestGDPpercapita':
      color = customMetric?.GDPcorrelation
        ? colorMatch[customMetric.GDPcorrelation]
        : 'black';
      break;
    case 'GINI':
      color = customMetric?.GINIcorrelation
        ? colorMatch[customMetric.GINIcorrelation]
        : 'black';
      break;
    case 'SEDA':
      color = customMetric?.SEDAcorrelation
        ? colorMatch[customMetric.SEDAcorrelation]
        : 'black';
      break;
    case 'avgHappyPlanet':
      color = customMetric?.Happycorrelation
        ? colorMatch[customMetric.Happycorrelation]
        : 'black';
      break;
    default:
      color = 'black';
  }
  return color;
}
export function correctMetric(item) {
  switch (item) {
    case 'avgGDPpercapita':
      return 'Average GDP per Capita';
    case 'latestGDPpercapita':
      return 'Latest GDP per Capita';
    case 'GINI':
      return 'GINI Inequality Index';
    case 'SEDA':
      return 'SEDA';
    case 'avgHappyPlanet':
      return 'Happy Planet Index';
    default:
      return item;
  }
}
export function correctVar(item) {
  switch (item) {
    case 'avgGDPpercapita':
      return 'GDPcorrelation';
    case 'latestGDPpercapita':
      return 'GDPcorrelation';
    case 'GINI':
      return 'GINIcorrelation';
    case 'SEDA':
      return 'SEDAcorrelation';
    case 'avgHappyPlanet':
      return 'Happycorrelation';
    default:
      return item;
  }
}
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

// Legend Scales

export const popScale = scaleLinear({
  domain: [20, 1386000000],
  range: [2, 60],
  nice: true,
});

export const continentScale = scaleOrdinal()
  .domain([
    'North America',
    'South America',
    'Europe',
    'Asia',
    'Africa',
    'Oceania',
  ])
  .range([
    DarkestBlue,
    Aqua,
    Marigold,
    Squash,
    'rgba(128, 101, 234, 1)',
    'rgba(26, 154, 226, 1)',
  ]);
export const lightContinentScale = scaleOrdinal()
  .domain([
    'North America',
    'South America',
    'Europe',
    'Asia',
    'Africa',
    'Oceania',
  ])
  .range([
    'rgba(34, 50, 116, 0.1)',
    'rgba(60, 161, 136, 0.1)',
    'rgba(235, 173, 92, 0.1)',
    'rgba(195, 91, 33, .1)',
    'rgba(128, 101, 234, 0.1)',
    'rgba(26, 154, 226, 0.1)',
  ]);

export const incomeScale = scaleOrdinal()
  .domain([
    'Low Income',
    'Lower Middle Income',
    'Upper Middle Income',
    'High Income',
  ])
  .range([DarkestBlue, Aqua, Marigold, Squash])
  .unknown('rgba(0, 5, 49,0.2)');
export const lightIncomeScale = scaleOrdinal()
  .domain([
    'Low Income',
    'Lower Middle Income',
    'Upper Middle Income',
    'High Income',
  ])
  .range([
    'rgba(34, 50, 116, 0.1)',
    'rgba(60, 161, 136, 0.1)',
    'rgba(235, 173, 92, 0.1)',
    'rgba(195, 91, 33, .1)',
  ])
  .unknown('rgba(0, 5, 49,.05)');
