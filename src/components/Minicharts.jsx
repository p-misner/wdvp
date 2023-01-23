import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.div`
  width: 100%;
  background-color: ${(props) => props.color || 'gray'};
  height: 600px;
`;

function Minicharts() {
  return <div>minicharts</div>;
}

export function PastDecadeSection() {
  return <SectionWrapper color="red">Past Decade</SectionWrapper>;
}
export function PresentWorldSection() {
  return <SectionWrapper color="blue">Present World</SectionWrapper>;
}
export function CountryCompareSection() {
  return <SectionWrapper color="orange">Country Compare</SectionWrapper>;
}
