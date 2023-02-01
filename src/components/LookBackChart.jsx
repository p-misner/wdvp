import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { tickFormatter } from './utils';
import { DarkTeal, Aqua, Marigold, Squash, maxWidth } from '../styleConstants';
import { pastDataArray } from './dataConstants';

const LookBackWrapper = styled.div`
  min-height: 400px;
  background: #fff;
  margin-top: 128px;
`;
const AllContent = styled.div`
  border-radius: 8px;
  margin: 0px auto;
  padding-bottom: 64px;
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
  p {
    font-size: 20px;
    // font-weight: 500;
    max-width: 600px;
    text-align: center;
  }
  button {
    color: #000531;
    border: none;
    background: none;
    font-size: 20px;
    cursor: pointer;
    &:hover {
      font-weight: 600;
      color: ${Aqua};
    }
  }
`;
const Bolded = styled.span`
  font-weight: 600;
`;

const PastSVG = styled.svg`
  margin: 0px auto;
`;
const HighlightChartTitle = styled.h3`
  margin: 0px 8px 16px 12px;
  color: #000531;

  font-size: 24px;
  font-weight: 600;
`;
// eslint-disable-next-line import/prefer-default-export
export function LookBackChart({ windowSize }) {
  const [pastData, setPastData] = useState(pastDataArray[0]);
  const [itemCount, setItemCount] = useState(0);
  const { length } = pastDataArray;

  const width = windowSize.width > 1400 ? 1300 : 0.9 * windowSize.width;
  const height = windowSize.width > 1000 ? 600 : 500;

  // TO DO: replace with spacing constants
  const margin = { top: 20, right: 28, bottom: 60, left: 80 };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  // useEffect(() => {}, []);
  const valueArray = pastData.data.map((x) =>
    parseFloat(x.value.replace(/,/g, ''))
  );
  const yearArray = pastData.data.map((x) =>
    parseInt(x.year.replace(/,/g, ''), 10)
  );
  const dataArray = pastData.data.map((x) => ({
    year: parseInt(x.year.replace(/,/g, ''), 10),
    value: parseFloat(x.value.replace(/,/g, '')),
  }));
  const yScale = scaleLinear({
    domain: [0.9 * Math.min(...valueArray), 1.1 * Math.max(...valueArray)],
    range: [yMax, 0],
    nice: true,
  });

  const yearScale = scaleLinear({
    domain: [Math.min(...yearArray), Math.max(...yearArray)],
    range: [0, xMax],
    nice: true,
  });
  const BottomDomain = Math.min(...valueArray);
  const TopDomain = Math.max(...valueArray);
  const rankingScale = scaleLinear()
    .domain([
      BottomDomain,
      BottomDomain + (TopDomain - BottomDomain) / 3,
      BottomDomain + (2 * (TopDomain - BottomDomain)) / 3,
      TopDomain,
    ])
    .range([Squash, Marigold, Aqua, DarkTeal]);

  return (
    <LookBackWrapper>
      <AllContent>
        <DashboardTitleWrapper>
          <div>
            {/* <h3>A Look Into the Past for</h3> */}
            {/* <h2>{pastData.metricTitle}</h2> */}
            <h2>A Look into the Past</h2>
          </div>

          <p>
            For some of the metrics listed in the Dashboard of the Present
            Future, take a journey back in time of the world average.
          </p>
        </DashboardTitleWrapper>
        <HighlightChartTitle>{pastData.metricTitle}</HighlightChartTitle>
        {pastData?.category === 'Global Health' && (
          <PastSVG width={width} height={height}>
            <defs>
              <linearGradient id="linearGrad">
                <stop offset="0%" stopColor={Squash} stopOpacity="1" />
                <stop offset="33%" stopColor={Marigold} stopOpacity="1" />
                <stop offset="66%" stopColor={Aqua} stopOpacity="1" />
                <stop offset="100%" stopColor={DarkTeal} stopOpacity="1" />
              </linearGradient>
            </defs>
            <Group left={margin.left} top={margin.top}>
              <GridRows
                scale={yScale}
                width={xMax}
                height={yMax}
                stroke="#B3B4C1"
              />
              {/* <GridColumns
              scale={yearScale}
              width={xMax}
              height={yMax}
              stroke="#B3B4C1"
            /> */}
              <AxisBottom
                top={yMax}
                scale={yearScale}
                // numTicks={5}
                stroke="#B3B4C1"
                strokeWidth="2px"
                tickStroke="#B3B4C1"
                // label="Year"
                labelOffset={4}
                labelProps={{
                  textAnchor: 'middle',
                  opacity: 0.6,
                  fontSize: 16,
                  fontWeight: 500,
                }}
                hideAxisLine
                tickLabelProps={() => ({
                  opacity: 0.6,
                  fontSize: 16,
                  textAnchor: 'middle',
                })}
                tickFormat={(value) => parseInt(value, 10)}
              />
              <g transform="translate(0,0)">
                <AxisLeft
                  scale={yScale}
                  hideAxisLine
                  tickStroke="#B3B4C1"
                  label={pastData.dataType}
                  labelOffset={48}
                  labelProps={{
                    textAnchor: 'middle',
                    opacity: 0.6,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                  tickLength={16}
                  tickLabelProps={() => ({
                    opacity: 0.6,
                    fontSize: 16,
                    textAnchor: 'end',
                  })}
                  numTicks={5}
                  tickFormat={(value) => tickFormatter(value)}
                />
              </g>
              <LinePath
                data={dataArray}
                x={(d) => yearScale(d.year)}
                y={(d) => yScale(d.value)}
                stroke="url(#linearGrad)"
                strokeWidth={30}
                strokeOpacity={0.8}
                strokeLinejoin="round"
              />

              {dataArray.map((d) => (
                <circle cx={yearScale(d.year)} cy={yScale(d.value)} r="10" />
              ))}
              {dataArray.map((d) => (
                <text
                  x={yearScale(d.year)}
                  y={yScale(d.value) - 20}
                  fill={rankingScale(d.value)}
                  textAnchor="middle"
                  style={{ fontWeight: 600 }}
                >
                  {' '}
                  {tickFormatter(d.value)}
                </text>
              ))}
            </Group>
          </PastSVG>
        )}{' '}
        <GridTitleHoriz>
          <button
            type="button"
            onClick={() => {
              setItemCount(itemCount !== 0 ? itemCount - 1 : length - 1);
              setPastData(
                pastDataArray[itemCount !== 0 ? itemCount - 1 : length - 1]
              );
            }}
          >
            ←
            {
              pastDataArray[itemCount === 0 ? length - 1 : itemCount - 1]
                .metricTitle
            }
          </button>
          <p>
            {' '}
            From {yearArray[0]} to {yearArray.slice(-1)}, the world saw a{' '}
            <Bolded>{pastData.conclusion} </Bolded>of {pastData.metricTitle}
          </p>
          <button
            type="button"
            onClick={() => {
              setItemCount((itemCount + 1) % length);
              setPastData(pastDataArray[(itemCount + 1) % length]);
            }}
          >
            {' '}
            {pastDataArray[(itemCount + 1) % length].metricTitle}→
          </button>
        </GridTitleHoriz>
      </AllContent>
    </LookBackWrapper>
  );
}

LookBackChart.propTypes = {
  windowSize: PropTypes.object.isRequired,
};
