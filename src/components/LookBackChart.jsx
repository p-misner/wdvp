import React, { useState } from 'react';
import styled from 'styled-components';
import { maxWidth } from '../styleConstants';

const data = [
  {
    metricTitle: 'Tubercolosis- Global Cases',
    category: 'Global Health',
    dataType: 'global cases',
    conclusion: 'Steady Downward Trend',
    data: [
      {
        year: '2009',
        value: '1417403',
      },
      {
        year: '2010',
        value: '1386717',
      },
      {
        year: '2011',
        value: '1,353,969',
      },
      {
        year: '2012',
        value: '1,321,313',
      },
      {
        year: '2013',
        value: '1,289,369',
      },
      {
        year: '2014',
        value: '1,261,016',
      },
      {
        year: '2015',
        value: '1236142.605',
      },
      {
        year: '2016',
        value: '1,213,057',
      },
    ],
  },
  { metricTitle: 'Second' },
  { metricTitle: 'Third' },
  { metricTitle: 'Fourth' },
  { metricTitle: 'Fifth' },
  { metricTitle: '6th' },
  { metricTitle: '7th' },
];

const LookBackWrapper = styled.div`
  min-height: 400px;
  background: #fff;
  margin-top: 128px;
`;
const AllContent = styled.div`
  border-radius: 8px;
  margin: 0px auto;
  width: 95vw;
  max-width: ${maxWidth};
`;
const DashboardTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px dashed #000531;
  padding: 64px 0px 24px 0px;
  margin-bottom: 24px;
  color: #000531;
  h3 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  h2 {
    font-size: 28px;
    font-weight: 600;
    margin-right: 24px;
    line-height: 36px;
    flex-grow: 1;
    min-width: 500px;
  }
  p {
    font-size: 18px;
    line-height: 24px;
    max-width: 800px;
    flex-grow: 1;
  }
  @media (max-width: 1200px) {
    h2 {
      min-width: 400px;
    }
  }
  @media (max-width: 900px) {
    flex-direction: column;
    h2 {
      min-width: none;
      margin-bottom: 8px;
    }
  }
  @media (max-width: 550px) {
    h2 {
      font-size: 24px;
      margin-bottom: 8px;
      min-width: 30px;
    }
    p {
      font-size: 16px;
    }
  }
`;
const GridTitleHoriz = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 12px;
  h3 {
    font-size: 20px;
    font-weight: 500;
  }
`;
const Bolded = styled.span`
  font-weight: 500;
`;

// eslint-disable-next-line import/prefer-default-export
export function LookBackChart() {
  const [pastData, setPastData] = useState(data[0]);
  const [itemCount, setItemCount] = useState(0);
  const { length } = data;
  return (
    <LookBackWrapper>
      <AllContent>
        <DashboardTitleWrapper>
          <div>
            <h3>A Look Into the Past for</h3>
            <h2>{pastData.metricTitle}</h2>
          </div>

          <p>
            Understand and explore how countries around the world are doing on
            variety different metrics. Highlight specific countries, compare
            against differnt metrics and change how charts are styled.
          </p>
        </DashboardTitleWrapper>
        <GridTitleHoriz>
          <button
            type="button"
            onClick={() => {
              setItemCount(itemCount !== 0 ? itemCount - 1 : length - 1);
              setPastData(data[itemCount !== 0 ? itemCount - 1 : length - 1]);
            }}
          >
            {data[itemCount === 0 ? length - 1 : itemCount - 1].metricTitle}
          </button>
          <p>
            {' '}
            From 2010 to 2019, the world saw a {pastData.conclusion} of{' '}
            {pastData.metricTitle}
          </p>
          <button
            type="button"
            onClick={() => {
              setItemCount((itemCount + 1) % length);
              setPastData(data[(itemCount + 1) % length]);
            }}
          >
            {' '}
            {data[(itemCount + 1) % length].metricTitle}
          </button>
        </GridTitleHoriz>
      </AllContent>
    </LookBackWrapper>
  );
}
