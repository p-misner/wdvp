import React from 'react';
import styled from 'styled-components';
import {
  boldWeight,
  heroFontSize,
  lrgSpacing,
  regFontSize,
  regSpacing,
  xlrgSpacing,
} from '../styleConstants';
import WGSlogo from '../media/WGS-summit-logo.svg';

const HeroWrapper = styled.div`
  margin-top: ${xlrgSpacing};
`;
const HeroText = styled.h1`
  font-size: ${heroFontSize};
  font-weight: ${boldWeight};
  max-width: 750px;
  text-align: center;
  line-height: 128px;
  margin: 0px auto;
`;
const WGSLogoStyle = styled.img`
  width: 240px;
  margin: 0px auto;
  display: block;
  margin-bottom: ${lrgSpacing};
`;
const Overline = styled.p`
  text-transform: uppercase;
  text-align: center;
  margin-top: ${lrgSpacing};
`;

const BodyCopy = styled.p`
  max-width: 750px;
  font-size: ${regFontSize};
  line-height: 120%;
  margin: 0px auto;
  margin-top: ${regSpacing};
`;
function Title() {
  return <HeroText> Explore a World of Data</HeroText>;
}
function DataAttribution() {
  return (
    <div>
      <Overline>Data Provided By: </Overline>
      <WGSLogoStyle src={WGSlogo} alt="logo for World Government Summit" />
    </div>
  );
}

function Hero() {
  return (
    <HeroWrapper>
      <Title />
      <DataAttribution />
      <BodyCopy>
        Lorem ipsum dolor sit amet consectetur. At nec massa amet mattis
        faucibus massa vivamus tempus. Risus ac faucibus scelerisque volutpat
        sed. Eu posuere etiam sagittis massa ut ac ultrices consequat. Volutpat
        placerat ultricies neque velit nisl proin luctus maecenas porttitor.
        Interdum sit cras platea suscipit ornare eu diam elit sollicitudin.
        Scelerisque ultrices tellus eu diam. Consequat turpis viverra gravida
        duis ac.
      </BodyCopy>
      <BodyCopy>
        Nisl egestas sit senectus consequat cras rhoncus ac. Mauris porttitor
        est diam bibendum penatibus ut. Blandit arcu iaculis lacus lectus mauris
        eu. Praesent sed fames arcu donec massa. Sed lobortis id phasellus non.
      </BodyCopy>
    </HeroWrapper>
  );
}
export default Hero;
