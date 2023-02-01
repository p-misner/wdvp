import React from 'react';
import styled from 'styled-components';
import { regSpacing, xlrgSpacing } from '../styleConstants';

const HeroWrapper = styled.div`
  margin-top: ${xlrgSpacing};
`;
const HeroText = styled.h1`
  font-size: 120px;
  color: #000531;
  font-weight: 700;
  text-align: left;
  line-height: 160px;
  letter-spacing: 0.01em;
  margin-top: 24px;
  @media (max-width: 1200px) {
    font-size: 90px;
    line-height: 110px;
  }
  @media (max-width: 550px) {
    font-size: 64px;
    line-height: 80px;
    margin-top: 0px;
  }
`;

const CopyFlex = styled.p`
  display: flex;
  flex-flow: column nowrap;
  margin-left: 48px;
  max-width: 600px;
  @media (max-width: 900px) {
    margin-left: 0px;
    max-width: none;
    margin-top: 16px;
  }
`;
const BodyCopy = styled.p`
  color: #000531;
  font-size: 18px;
  line-height: 30px;
  margin-top: ${regSpacing};
  @media (max-width: 550px) {
    font-size: 16px;
    line-height: 20px;
  }
`;

const AllHeroText = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  margin: 0px auto;
  margin-bottom: 128px;
  width: 1050px;
  @media (max-width: 1200px) {
    width: 90%;
  }
  @media (max-width: 550px) {
    width: 100%;
  }
`;
const HorizontalHeroText = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  @media (max-width: 900px) {
    flex-flow: column wrap;
  }
`;

const Bolded = styled.span`
  font-weight: 500;
`;
function Hero() {
  return (
    <HeroWrapper>
      <AllHeroText>
        <HeroText> Explore a World</HeroText>
        <HorizontalHeroText>
          <HeroText style={{ flexShrink: '0' }}>of Data</HeroText>
          <CopyFlex>
            <BodyCopy>
              There’s a huge wealth of information on the state of the world but
              the sheer volume of data can make it challenging to understand
              what’s going on. By viewing data through different lenses, key
              insights can emerge.
            </BodyCopy>
            <BodyCopy>
              Using data provided as part of the World Government Summit’s
              <Bolded> World Data Visualization Prize 2023</Bolded>, this
              website helps you explore how the world as a whole or specific
              countries are doing. View everything through one country&apos;s
              perspective, explore the data through specfic lens (like income
              levels, world ranking, overall trend) or look at certain metrics
              over the past decade- the choice is yours!
            </BodyCopy>
          </CopyFlex>
        </HorizontalHeroText>
      </AllHeroText>
    </HeroWrapper>
  );
}
export default Hero;
