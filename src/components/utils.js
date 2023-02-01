import React, { useState, useEffect } from 'react';
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
