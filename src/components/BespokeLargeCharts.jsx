/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { contourDensity } from 'd3-contour';
import { geoPath } from 'd3-geo';
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
import {
  tickFormatter,
  contourColor,
  correctVar,
  correctMetric,
} from './utils';

const ScatterSVG = styled.svg`
  width: 800px;
  overflow: visible;
  @media (max-width: 1000px) {
    width: 100%;
  }
`;
const InChartButtonWrapper = styled.div`
  position: absolute;
  top: ${(props) =>
    props.position === 'bottom' ? (!props.width ? '490px' : '10px') : '10px'};
  right: 20px;
  background: white;
  padding: 2px;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  p {
    margin-right: 8px;
    color: #000531;
  }
`;

const SwitchWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  input:checked + .slider {
    background-color: #000531;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #000531;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
  }
`;

const SliderWrapper = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999bab;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
  &:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const SVGOverline = styled.text`
  font-size: 14px;
  font-weight: 600;
  fill: #999bad;
  pointer-events: none;
`;
const SVGOverlineHeavy = styled.text`
  font-size: 14px;
  font-weight: 600;
  stroke-width: 2px;
  stroke: white;
  pointer-events: none;
`;
const GINIWrapper = styled.div`
  margin-bottom: 8px;
  position: relative;
  width: 800px;
  @media (max-width: 1000px) {
    width: 100%;
  }
`;
export function GINI({
  data,
  xMetric,
  colorBy,
  selectedCountry,
  customMetric,
  windowSize,
}) {
  const [scaleByPop, setScaleByPop] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  const width = windowSize.width < 800 ? 600 : 800;
  const height = windowSize.width < 800 ? 400 : 620;

  // TO DO: replace with spacing constants
  const margin = { top: 20, right: 10, bottom: 60, left: 52 };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  console.log(customMetric);
  // domain changes depending on metric (not based on min max)
  const controlPosition = customMetric?.controlPosition
    ? customMetric.controlPosition
    : 'top';

  // scales
  const xScale = scaleLinear({
    domain: [
      Math.min(...data.map((x) => x[xMetric])),
      Math.max(...data.map((x) => x[xMetric])),
    ],
    range: [0, xMax],
    nice: true,
  });
  const yScale = scaleLinear({
    domain: customMetric?.domain,
    range: [yMax, 0],
    nice: true,
  });
  const popScale = scaleLinear({
    domain: [20, 1386000000],
    range: [2, 60],
    nice: true,
  });

  const BottomDomain = Math.min(...data.map((x) => x.avgVal));
  const TopDomain = Math.max(...data.map((x) => x.avgVal));
  const rankingScale = scaleLinear()
    .domain([
      BottomDomain,
      BottomDomain + (TopDomain - BottomDomain) / 3,
      BottomDomain + (2 * (TopDomain - BottomDomain)) / 3,
      TopDomain,
    ])
    .range([DarkTeal, Aqua, Marigold, Squash]);

  const continentScale = scaleOrdinal()
    .domain([
      'North America',
      'South America',
      'Europe',
      'Asia',
      'Africa',
      'Australia',
    ])
    .range(['red', 'orange', 'yellow', 'green', 'blue', 'purple']);
  const incomeScale = scaleOrdinal()
    .domain([
      'Low Income',
      'Lower Middle Income',
      'Upper Middle Income',
      'High Income',
    ])
    .range([DarkestBlue, Aqua, Marigold, Squash])
    .unknown('black');

  // contour
  const contour = contourDensity()
    .x((d) => xScale(d[xMetric]))
    .y((d) => yScale(d.avgVal))
    .size([width, height])
    .bandwidth(12)
    .thresholds(10)(data);
  const pathGenerator = geoPath();

  // TOOLTIP
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip, // on hover we will call this function to show tooltip
    hideTooltip, // and this one to hide it
  } = useTooltip();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  });
  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: '#ffffff',
    color: '#000531',
    border: '1px solid #000531',
    borderRadius: 8,
    // width: 152,
    // height: 72,
    padding: '12px',
    lineHeight: '20px',
    fontSize: '16px',
  };

  function HoverStyleReset(e) {
    e.target.style['-webkit-filter'] = 'drop-shadow(0px 0px 0px #fff)';
    e.target.style.filter = 'drop-shadow(0px 0px 0px #fff)';
  }

  let tooltipTimeout;
  const TooltipTimer = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);

  const similarCountries = ['China', 'United States', 'India', 'Argentina'];
  const allLabeledCountries = showSimilar
    ? ['China', 'United States', 'India', 'Argentina'].concat([selectedCountry])
    : [''].concat([selectedCountry]);

  return (
    <GINIWrapper>
      <InChartButtonWrapper
        width={windowSize.width < 800}
        position={controlPosition}
      >
        <p> Scale by Population:</p>
        <SwitchWrapper className="switch" htmlFor="control">
          <input type="checkbox" id="control" />
          <SliderWrapper
            className="slider round"
            onClick={() => setScaleByPop(!scaleByPop)}
          />
        </SwitchWrapper>
      </InChartButtonWrapper>

      <ScatterSVG
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        ref={containerRef}
        preserveAspectRatio="xMinYMin"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon fill="#999BAD" points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#B3B4C1"
          />
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#B3B4C1"
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            numTicks={5}
            stroke="#B3B4C1"
            strokeWidth="2px"
            tickStroke="#B3B4C1"
            label={correctMetric(xMetric)}
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
            tickFormat={(value) => tickFormatter(value)}
          />
          <g transform="translate(0,0)">
            <AxisLeft
              scale={yScale}
              hideAxisLine
              tickStroke="#B3B4C1"
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
          <line
            x1={-16}
            x2={width - margin.right - margin.left}
            y1={yScale(0) - 1.5}
            y2={yScale(0) - 1.5}
            stroke="#999BAD"
            strokeWidth="3"
          />
          <g className="contourGroup">
            {colorBy === 'Correlation'
              ? contour.map((x, i) => (
                  <path
                    // eslint-disable-next-line react/no-array-index-key
                    key={`contour${i}}`}
                    d={pathGenerator(x)}
                    fill={contourColor({
                      xMetric,
                      customMetric,
                    })}
                    stroke={contourColor({ customMetric, xMetric })}
                    fillOpacity={i > 3 ? 0.3 : 0.2}
                    strokeWidth="0.5"
                  />
                ))
              : null}
          </g>
          <g className="points">
            {data.map((d) => (
              <circle
                key={d.country}
                cx={xScale(d[xMetric])}
                cy={yScale(d.avgVal)}
                r={
                  Math.abs(d.avgVal) < 0.0001 || Math.abs(d[xMetric]) < 0.0001
                    ? '0'
                    : d.country === selectedCountry
                    ? '30'
                    : scaleByPop
                    ? popScale(d.population)
                    : colorBy === 'Correlation'
                    ? '3'
                    : '5'
                }
                fill={
                  colorBy === 'Ranking'
                    ? rankingScale(d.avgVal)
                    : colorBy === 'Continent'
                    ? continentScale(d.continent)
                    : colorBy === 'Income'
                    ? incomeScale(d.incomeLevel)
                    : '#000531'
                }
                fillOpacity="0.8"
                strokeWidth={
                  d.country === selectedCountry
                    ? '3'
                    : similarCountries.indexOf(d.country) > -1
                    ? '2'
                    : '1'
                }
                stroke="#000531"
                onMouseEnter={function (e) {
                  e.target.style['-webkit-filter'] =
                    'drop-shadow(-2px -2px 0px #000531)';
                  e.target.style.filter = 'drop-shadow(-2px -2px 0px #000531)';
                }}
                onMouseMove={() => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  const top = yScale(d.avgVal) + margin.top;
                  const left = xScale(d[xMetric]) + margin.left;
                  showTooltip({
                    tooltipData: d,
                    tooltipTop: top,
                    tooltipLeft: left,
                  });
                }}
                onMouseLeave={(e) => {
                  TooltipTimer();
                  HoverStyleReset(e);
                }}
              />
            ))}
          </g>
          <g className="labels">
            {customMetric?.upperText ? (
              <g className="upperText">
                <SVGOverlineHeavy x={20} y={40}>
                  {customMetric.upperText}
                </SVGOverlineHeavy>
                <SVGOverline x={20} y={40}>
                  {customMetric.upperText}
                </SVGOverline>
                <line
                  x1="10"
                  y1="60"
                  x2="10"
                  y2="20"
                  stroke="#999BAD"
                  strokeWidth="1"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            ) : null}
            {customMetric?.lowerText ? (
              <g className="lowerText">
                <SVGOverlineHeavy
                  x={20}
                  y={height - margin.top - margin.bottom - 30}
                >
                  {customMetric.lowerText}
                </SVGOverlineHeavy>

                <SVGOverline
                  x={20}
                  y={height - margin.top - margin.bottom - 30}
                >
                  {customMetric.lowerText}
                </SVGOverline>
                <line
                  x1="10"
                  y1={height - margin.top - margin.bottom - 60}
                  x2="10"
                  y2={height - margin.top - margin.bottom - 20}
                  stroke="#999BAD"
                  strokeWidth="1"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            ) : null}
          </g>
          {data.map((d) => (
            <g style={{ pointerEvents: 'none' }}>
              <text
                strokeWidth={
                  Math.abs(d.avgVal) < 0.001 || Math.abs(d[xMetric]) < 0.001
                    ? '0'
                    : allLabeledCountries.indexOf(d.country) > -1
                    ? '5'
                    : '0'
                }
                stroke="white"
                x={xScale(d[xMetric]) + 8}
                y={yScale(d.avgVal) + 4}
                fill={
                  Math.abs(d.avgVal) < 0.001 || Math.abs(d[xMetric]) < 0.001
                    ? 'none'
                    : allLabeledCountries.indexOf(d.country) > -1
                    ? 'white'
                    : 'none'
                }
              >
                {d.country}
              </text>
              <text
                x={xScale(d[xMetric]) + 8}
                y={yScale(d.avgVal) + 4}
                fill={
                  Math.abs(d.avgVal) < 0.001 || Math.abs(d[xMetric]) < 0.001
                    ? 'none'
                    : allLabeledCountries.indexOf(d.country) > -1
                    ? '#000531'
                    : 'none'
                }
              >
                {d.country}
              </text>
            </g>
          ))}
        </Group>
      </ScatterSVG>
      {tooltipOpen && (
        <TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <p style={{ fontWeight: 500 }}> {tooltipData.country}</p>
          <p>
            {customMetric.seriesName}: {tooltipData.avgVal}
          </p>
          <p>
            {xMetric}: {tooltipData[xMetric]}
          </p>
        </TooltipInPortal>
      )}
    </GINIWrapper>
  );
}
GINI.propTypes = {
  data: PropTypes.array.isRequired,
  xMetric: PropTypes.string.isRequired,
  selectedCountry: PropTypes.string.isRequired,
  customMetric: PropTypes.object.isRequired,
  windowSize: PropTypes.object.isRequired,
  colorBy: PropTypes.string.isRequired,
};

const StripLegendWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 30vw;
  & :first-child div {
    border-radius: 8px 0px 0px 8px;
  }
  & :last-child div {
    border-radius: 0px 8px 8px 0px;
  }
`;
const StripLegendItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0px;
  p {
    padding-left: 4px;
    padding-top: 4px;
    opacity: 0.6;
  }
`;
const ColorRect = styled.div`
  width: 100%;
  height: 24px;
  background: ${(props) => props.color || '#999BAD'};
  opacity: 0.9;
  border: 2px solid #000531;
`;
const SmallColorRect = styled.div`
  width: 20px;
  min-width: 20px;
  height: 20px;
  background: ${(props) => props.color || '#999BAD'};
  opacity: 0.9;
  border: 2px solid #000531;
  border-radius: 8px;
`;
const PillsLegendWrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-flow: row wrap;
  @media (max-width: 1300px) {
    flex-flow: column wrap;
  }
  @media (max-width: 1000px) {
    flex-flow: row wrap;
  }
`;
const PillsLegendItem = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 8px;
  p {
    padding-left: 4px;
    padding-top: 4px;
    opacity: 0.7;
  }
`;
const RankingLegendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const GradientRect = styled.div`
  width: 100%;
  background: linear-gradient(
    90deg,
    ${DarkTeal},
    ${Aqua},
    ${Marigold},
    ${Squash}
  );
  border: 2px solid #000531;
  border-radius: 8px;
  height: 24px;
`;
const LabelWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  justify-content: space-between;
  opacity: 0.7;
  margin-top: 4px;
`;

function IncomeLegend() {
  // wouldn't it be fun if the symbols weren't rectangles but the continent shape instead??
  return (
    <PillsLegendWrapper>
      <PillsLegendItem>
        <SmallColorRect color={DarkestBlue} /> <p>Low</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color={Aqua} /> <p>Lower Middle</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color={Marigold} /> <p>Upper Middle</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color={Squash} /> <p>High</p>
      </PillsLegendItem>
    </PillsLegendWrapper>
  );
}

function CorrelationLegend() {
  // wouldn't it be fun if the symbols weren't rectangles but the continent shape instead??
  return (
    <PillsLegendWrapper>
      <PillsLegendItem>
        <SmallColorRect color={Aqua} /> <p>Strong Positive</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color={PaleGreen} /> <p>Weak Positive</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color={PaleBlue} /> <p>None</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color={Melon} /> <p>Weak Positive</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color={Squash} /> <p>Strong Negative</p>
      </PillsLegendItem>
    </PillsLegendWrapper>
  );
}
function RankingLegend() {
  return (
    <RankingLegendWrapper>
      <GradientRect />
      <LabelWrapper>
        <p> Lower</p>
        <p> Higher</p>
      </LabelWrapper>
    </RankingLegendWrapper>
  );
}
function ContinentLegend() {
  // wouldn't it be fun if the symbols weren't rectangles but the continent shape instead??
  return (
    <PillsLegendWrapper>
      <PillsLegendItem>
        <SmallColorRect color="red" /> <p>North America</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color="orange" /> <p>South America</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color="yellow" /> <p>Europe</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color="green" /> <p>Asia</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color="blue" /> <p>Africa</p>
      </PillsLegendItem>
      <PillsLegendItem>
        <SmallColorRect color="purple" /> <p>Oceania</p>
      </PillsLegendItem>
    </PillsLegendWrapper>
  );
}
const LegendTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: capitalize;
`;
export function Legend({ colorBy }) {
  return (
    <div style={{ paddingTop: '12px' }}>
      {colorBy === 'Income' ? (
        <IncomeLegend />
      ) : colorBy === 'Ranking' ? (
        <RankingLegend />
      ) : colorBy === 'Continent' ? (
        <ContinentLegend />
      ) : (
        <CorrelationLegend />
      )}
    </div>
  );
}
Legend.propTypes = {
  colorBy: PropTypes.string.isRequired,
};

const BackgroundInfoWrapper = styled.div`
  margin-top: 24px;
  width: 100%;
  border: 2px solid #000531;
  border-radius: 8px;
`;
const TwoColumnInfo = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 600px;
  p {
    font-size: 18px;
    margin: 16px 16px;
  }
`;
const TitleColumn = styled.p`
  width: 100%;
  max-width: 80px;
`;
const TitleBlock = styled.div`
  padding: 12px 16px 0px 16px;
  border-bottom: 2px solid #000531;
  background: ${(props) => props.color || '#e2e2e2'};
  border-radius: 8px 8px 0px 0px;
  h1 {
    font-size: 20px;
    font-weight: 600;
  }
`;
export function BackgroundInfo({ xMetric, customMetric }) {
  return (
    <BackgroundInfoWrapper>
      <TitleBlock color={contourColor({ xMetric, customMetric })}>
        <h1>
          {customMetric[correctVar(xMetric)]} Correlation with{' '}
          {correctMetric(xMetric)}
        </h1>
      </TitleBlock>
      <TwoColumnInfo>
        <TitleColumn>Definition: </TitleColumn>
        <p>GDP Growth means how quickly an economy is growing. </p>
      </TwoColumnInfo>
      <TwoColumnInfo>
        <TitleColumn>Source: </TitleColumn>
        <p>World Bank. Where available, values from 2019-2020 averaged.</p>
      </TwoColumnInfo>
    </BackgroundInfoWrapper>
  );
}
BackgroundInfo.propTypes = {
  xMetric: PropTypes.string.isRequired,
  customMetric: PropTypes.object.isRequired,
};

const RankingWrapper = styled.div`
  h1 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    text-transform: capitalize;
  }
  border: 2px solid #000531;
  border-radius: 8px;
  margin-top: ${(props) => (props.position === 'bottom' ? '0px' : '24px')};
`;
const RankingList = styled.div`
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
  max-height: ${(props) => (props.position === 'bottom' ? '180px' : '390px')};
  margin: 12px;
`;
const RankItem = styled.div`
  color: #000531;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px solid #e2e2e2;
  border: ${(props) => `1px solid ${props.color}` || 'none'};
  background: ${(props) => props.color || 'none'};
  color: ${(props) => (props.color === '#000531' ? 'white' : 'black')};
  p {
    font-size: 16px;
  }
  p:first-child {
    width: 32px;
    padding-right: 12px;
    overflow: hidden;
    text-align: right;
    font-weight: 600;
  }
  p:nth-child(2) {
    width: 150px;
    padding-right: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :nth-child(even) {
    // background: #f9f9f9;
  }
`;
const RankSVG = styled.svg`
  height: 38px;
  width: 100%;
`;
export function RankingInfo({
  position,
  rankingData,
  customMetric,
  selectedCountry,
}) {
  const ele = document.getElementById(selectedCountry);
  console.log(ele);
  useEffect(() => {
    if (ele !== null) {
      ele.scrollIntoView();
    }
  }, [selectedCountry]);

  const margin = { left: 10, right: 25 };
  const xScale = scaleLinear({
    domain: customMetric?.domain,
    range: [margin.left, 353 - margin.right],
    nice: true,
  });

  const BottomDomain = Math.min(...rankingData.map((x) => x.avgVal));
  const TopDomain = Math.max(...rankingData.map((x) => x.avgVal));
  const rankingScale = scaleLinear()
    .domain([
      BottomDomain,
      BottomDomain + (TopDomain - BottomDomain) / 3,
      BottomDomain + (2 * (TopDomain - BottomDomain)) / 3,
      TopDomain,
    ])
    .range([DarkTeal, Aqua, Marigold, Squash]);
  return (
    <RankingWrapper position={position}>
      <TitleBlock color="#fff">
        <h1>Ranking By {customMetric.seriesName}</h1>
      </TitleBlock>
      <RankingList position={position}>
        {rankingData.map((x) => (
          <RankItem
            key={x.country}
            id={x.country}
            color={x.country === selectedCountry ? '#000531' : 'none'}
          >
            <p>{x.rank}</p>
            <p>{x.country}</p>
            <RankSVG viewBox="0 0 353 38">
              <defs>
                <linearGradient id="grayLeft">
                  <stop offset="0%" stopColor="#f6f6f6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f6f6f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="grayRight">
                  <stop offset="0%" stopColor="#f6f6f6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#f6f6f6" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="blueLeft">
                  <stop offset="0%" stopColor={PaleBlue} stopOpacity="1" />
                  <stop offset="100%" stopColor={PaleBlue} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="blueRight">
                  <stop offset="0%" stopColor={PaleBlue} stopOpacity="0" />
                  <stop offset="100%" stopColor={PaleBlue} stopOpacity="1" />
                </linearGradient>
              </defs>

              <rect
                y="8"
                x={xScale(x.avgVal) - 16 + margin.left}
                width="32"
                height="20"
                fill={rankingScale(x.avgVal)}
              />
              <rect
                y="8"
                x={xScale(x.avgVal) - 17 + margin.left}
                width="13"
                height="20"
                fill={
                  x.country === selectedCountry
                    ? 'url(#blueLeft)'
                    : 'url(#grayLeft)'
                }
              />
              <rect
                y="8"
                x={xScale(x.avgVal) + 3 + margin.left}
                width="13"
                height="20"
                fill={
                  x.country === selectedCountry
                    ? 'url(#blueRight)'
                    : 'url(#grayRight)'
                }
              />
              <circle
                cy="18"
                cx={xScale(x.avgVal) + margin.left}
                r="7"
                fill="none"
                stroke="#000531"
                strokeWidth="1.5"
              />
              <text
                y="24"
                x={
                  xScale(x.avgVal) > 70
                    ? xScale(x.avgVal) - 35 + margin.left
                    : xScale(x.avgVal) + 60 + margin.left
                }
                textAnchor="end"
                //   fontFamily="monospace"
                fontWeight="600"
                fill={rankingScale(x.avgVal)}
              >
                {x.avgVal > 1000
                  ? `${(x.avgVal / 1000).toFixed(1)}k`
                  : x.avgVal.toFixed(1)}
              </text>
            </RankSVG>
          </RankItem>
        ))}
      </RankingList>
    </RankingWrapper>
  );
}
RankingInfo.propTypes = {
  selectedCountry: PropTypes.string.isRequired,
  rankingData: PropTypes.array.isRequired,
  customMetric: PropTypes.object.isRequired,
  position: PropTypes.string,
};
RankingInfo.defaultProps = {
  position: 'side',
};
