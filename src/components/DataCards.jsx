import React from 'react';
import styled from 'styled-components';
import windmills from '../media/windmills.png';
import women from '../media/women.png';
import arrow from '../media/arrow.png';

const DataCardGrid = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 540px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;
const DataCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  //   border: 2px solid #000531;
  width: 100%;
  min-width: 215px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px 10px rgba(0, 5, 49, 0.08);
  color: #000531;
  p {
    margin: 16px;
    font-size: 18px;
    line-height: 28px;
  }
`;
const HighlightedDataCardWrapper = styled.div`
  background: #000531;
  //   border: 2px solid #000531;
  box-shadow: 0px 4px 10px 10px rgba(0, 5, 49, 0.08);

  width: 100%;
  border-radius: 8px;
  p {
    margin: 16px;
    font-size: 18px;
    line-height: 28px;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 600;
  color: #000531;
  margin-bottom: 16px;
`;

const GridWrapper = styled.div`
  padding: 0px 0px 128px 0px;
  //   background: red;
`;
const Bolded = styled.span`
  font-weight: 600;
`;
const BoldedWhite = styled.span`
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
`;
const Chip = styled.span`
  background: #000531;
  font-weight: 500;
  color: white;
  padding: 4px;
  border-radius: 4px;
`;

const CardImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin: 0px auto;
  @media (max-width: 600px) {
    max-height: 100px;
  }
`;

// eslint-disable-next-line import/prefer-default-export
export function DataCard() {
  return (
    <GridWrapper>
      {/* <Title> What the Data Reveals</Title> */}
      <DataCardGrid>
        <DataCardWrapper>
          <p>
            Seven countries generate <Chip>100%</Chip> of their electricity from
            renewable sources: <Bolded>Albania</Bolded>, <Bolded>Bhutan</Bolded>
            , <Bolded>Ethiopia</Bolded>, <Bolded>Iceland</Bolded>,{' '}
            <Bolded>Lesotho</Bolded>, <Bolded>Nepal</Bolded> and{' '}
            <Bolded>Paraguay</Bolded>.
          </p>
          <CardImage src={windmills} alt="windmill mage" />
        </DataCardWrapper>
        <DataCardWrapper>
          <p>
            A majority of members in national parliaments in{' '}
            <Bolded>Rwanda</Bolded> and <Bolded>Bolivia</Bolded> are women.
          </p>
          <CardImage src={women} alt="women image" />
        </DataCardWrapper>
        <DataCardWrapper>
          <p>
            <Bolded>Mauritania</Bolded>, <Bolded>Solomon Islands</Bolded>,{' '}
            <Bolded>Namibia</Bolded> and <Bolded>Bolivia</Bolded> all spend more
            on education (as a % of GDP) than any <Chip>High Income</Chip>{' '}
            country.
          </p>
        </DataCardWrapper>

        {/* <HighlightedDataCardWrapper>
          <p>
            Interested in <BoldedWhite>discovering more stories</BoldedWhite>{' '}
            like this within the data? Explore the data in the Dashboard of the
            Present Future to see where these insights came from and discover
            more.
          </p>
          <CardImage src={arrow} alt="arrow pointing down" />
        </HighlightedDataCardWrapper> */}
      </DataCardGrid>
    </GridWrapper>
  );
}
