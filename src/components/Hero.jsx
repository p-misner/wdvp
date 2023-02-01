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

function Hero() {
  return (
    <HeroWrapper>
      <AllHeroText>
        <HeroText> Explore a World</HeroText>
        <HorizontalHeroText>
          <HeroText style={{ flexShrink: '0' }}>of Data</HeroText>
          <CopyFlex>
            <BodyCopy>
              Lorem ipsum dolor sit amet consectetur. At nec massa amet mattis
              faucibus massa vivamus tempus. Risus ac faucibus scelerisque
              volutpat sed. Eu posuere etiam sagittis massa ut ac ultrices
              consequat. Volutpat placerat ultricies neque velit nisl proin
              luctus maecenas porttitor. Interdum sit cras platea suscipit
              ornare eu diam elit sollicitudin. Scelerisque ultrices tellus eu
              diam. Consequat turpis viverra gravida duis ac.
            </BodyCopy>
            <BodyCopy>
              Lorem ipsum dolor sit amet consectetur. At nec massa amet mattis
              faucibus massa vivamus tempus. Risus ac faucibus scelerisque
              volutpat sed. Eu posuere etiam sagittis massa ut ac ultrices
              consequat. Volutpat placerat ultricies neque velit nisl proin
              luctus maece.
            </BodyCopy>
          </CopyFlex>
        </HorizontalHeroText>
      </AllHeroText>
    </HeroWrapper>
  );
}
export default Hero;
