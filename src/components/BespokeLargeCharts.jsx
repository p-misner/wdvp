import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GridRows, GridColumns } from '@visx/grid';
import {
  scaleLinear,
  scaleLog,
  scaleOrdinal,
  scaleQuantile,
} from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
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
} from '../styleConstants';

const ScatterSVG = styled.svg``;
const InChartButtonWrapper = styled.div`
  position: absolute;
  top: ${(props) => (props.position === 'bottom' ? '460px' : '10px')};
  right: 20px;
  background: white;
  padding: 2px;
  p {
    margin-bottom: 4px;
  }
`;
const InChartButton = styled.button`
  background: ${(props) => (props.active ? 'black' : 'none')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  border: 1px solid black;
  border-radiys: 2px;
  padding: 4px 6px;
  font-size: ${regFontSize};

  &:hover {
    background: ${(props) => (props.active ? 'black' : 'lightgray')};
  }
`;
const SVGOverline = styled.text`
  font-size: 14px;
  font-weight: 600;
  fill: #6e6d6d;
  pointer-events: none;
`;
const SVGOverlineHeavy = styled.text`
  font-size: 14px;
  font-weight: 600;
  stroke-width: 2px;
  stroke: white;
  pointer-events: none;
`;

function tickFormatter(value) {
  if (value > 1000) {
    return `${value / 1000}k`;
  }
  return value;
}
export function GINI({ data, xMetric, colorBy, customMetric }) {
  const [scaleByPop, setScaleByPop] = useState(false);

  const width = 800;
  const height = 600;

  // TO DO: replace with spacing constants
  const margin = { top: 20, right: 10, bottom: 60, left: 52 };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

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

  function HoverStyleReset(e) {
    e.target.style.strokeWidth = '1';
  }

  let tooltipTimeout;
  const TooltipTimer = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);

  return (
    <div style={{ marginBottom: 64, position: 'relative', maxWidth: '800px' }}>
      <InChartButtonWrapper position={controlPosition}>
        <p> Scale by:</p>
        <InChartButton
          active={!scaleByPop}
          onClick={() => setScaleByPop(false)}
          type="button"
        >
          None
        </InChartButton>
        <InChartButton
          active={scaleByPop}
          onClick={() => setScaleByPop(true)}
          type="button"
        >
          Population
        </InChartButton>
      </InChartButtonWrapper>

      <ScatterSVG
        width="100%"
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
            <polygon fill="gray" points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            numTicks={5}
            stroke="gray"
            strokeWidth="2px"
            tickStroke="#e0e0e0"
            label={xMetric}
            labelOffset={20}
            labelProps={() => ({
              textAnchor: 'start',
              opacity: 0.6,
              fontSize: 16,
            })}
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
              tickStroke="#e0e0e0"
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
          <g className="contourGroup">
            {colorBy === 'correlation'
              ? contour.map((x, i) => (
                  <path
                    // eslint-disable-next-line react/no-array-index-key
                    key={`contour${i}}`}
                    d={pathGenerator(x)}
                    fill={Carrot}
                    stroke={Carrot}
                    fillOpacity={i > 3 ? 0.3 : 0.2}
                    strokeWidth={0.5}
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
                  Math.abs(d.avgVal) < 0.001 || Math.abs(d[xMetric]) < 0.001
                    ? '0'
                    : scaleByPop
                    ? popScale(d.population)
                    : colorBy === 'correlation'
                    ? '3'
                    : '5'
                }
                fill={
                  colorBy === 'ranking'
                    ? rankingScale(d.avgVal)
                    : colorBy === 'continent'
                    ? continentScale(d.continent)
                    : colorBy === 'income'
                    ? incomeScale(d.incomeLevel)
                    : 'black'
                }
                fillOpacity="0.8"
                stroke="black"
                onMouseEnter={function (e) {
                  //   e.target.style.stroke = Squash;
                  //   e.target.style.fill = Marigold;
                  //   e.target.style.fillOpacity = '1';
                  e.target.style.strokeWidth = '3';
                }}
                //   onMouseMove={handleMouseMove}
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
                  stroke="gray"
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
                  stroke="gray"
                  strokeWidth="1"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            ) : null}
          </g>
          {/* {data.map((d) => (
            <g style={{ pointerEvents: 'none' }}>
              <text
                strokeWidth={
                  Math.abs(d.avgVal) < 0.001 || Math.abs(d[xMetric]) < 0.001
                    ? '0'
                    : ['China', 'United States', 'India', 'Argentina'].indexOf(
                        d.country
                      ) > -1
                    ? '2'
                    : '0'
                }
                stroke="white"
                x={xScale(d[xMetric]) + 8}
                y={yScale(d.avgVal) + 4}
                fill={
                  Math.abs(d.avgVal) < 0.001 || Math.abs(d[xMetric]) < 0.001
                    ? 'none'
                    : ['China', 'United States', 'India', 'Argentina'].indexOf(
                        d.country
                      ) > -1
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
                    : ['China', 'United States', 'India', 'Argentina'].indexOf(
                        d.country
                      ) > -1
                    ? 'black'
                    : 'none'
                }
              >
                {d.country}
              </text>
            </g>
          ))} */}
        </Group>
      </ScatterSVG>
      {tooltipOpen && (
        <TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          <p> {tooltipData.country}</p>
          <p> GDP: {Math.round(tooltipData[xMetric]) / 1000}k</p>
          <p> value: {tooltipData.avgVal}</p>
        </TooltipInPortal>
      )}
    </div>
  );
}
GINI.propTypes = {
  data: PropTypes.array.isRequired,
  xMetric: PropTypes.string.isRequired,
  customMetric: PropTypes.object.isRequired,
  colorBy: PropTypes.string.isRequired,
};

const StripLegendWrapper = styled.div`
  display: flex;
  flex-direction: row;
  //   min-width: 00px;
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
  background: ${(props) => props.color || 'gray'};
  opacity: 0.9;
  border: 2px solid black;
`;
const SmallColorRect = styled.div`
  width: 20px;
  height: 20px;
  background: ${(props) => props.color || 'gray'};
  opacity: 0.9;
  border: 2px solid black;
  border-radius: 8px;
`;
const PillsLegendWrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-flow: row wrap;
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
const RankingWrapper = styled.div`
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
  border: 2px solid black;
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
  return (
    <StripLegendWrapper>
      <StripLegendItem>
        <ColorRect color={DarkestBlue} />
        <p>Low </p>
      </StripLegendItem>
      <StripLegendItem>
        <ColorRect color={Aqua} />
        <p>Lower Middle</p>
      </StripLegendItem>
      <StripLegendItem>
        <ColorRect color={Marigold} />
        <p>Upper Middle</p>
      </StripLegendItem>
      <StripLegendItem>
        <ColorRect color={Squash} />
        <p>High</p>
      </StripLegendItem>
    </StripLegendWrapper>
  );
}
function RankingLegend() {
  return (
    <RankingWrapper>
      <GradientRect />
      <LabelWrapper>
        <p> Lower</p>
        <p> Higher</p>
      </LabelWrapper>
    </RankingWrapper>
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
export function Legend({ xMetric, colorBy, customMetric }) {
  return (
    <div>
      <LegendTitle>Legend {colorBy}</LegendTitle>
      {colorBy === 'income' ? (
        <IncomeLegend />
      ) : colorBy === 'ranking' ? (
        <RankingLegend />
      ) : (
        <ContinentLegend />
      )}
    </div>
  );
}
Legend.propTypes = {
  xMetric: PropTypes.string.isRequired,
  customMetric: PropTypes.object.isRequired,
  colorBy: PropTypes.string.isRequired,
};

const BackgroundInfoWrapper = styled.div`
  margin-top: 24px;
  width: 100%;
  border: 2px solid black;
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
  padding: 12px 16px;
  border-bottom: 2px solid black;
  background: #e2e2e2;
  border-radius: 8px 8px 0px 0px;
  h1 {
    font-size: 20px;
    font-weight: 600;
  }
`;
export function BackgroundInfo() {
  return (
    <BackgroundInfoWrapper>
      <TitleBlock>
        <h1>No Strong Correlation with GDP Growth</h1>
      </TitleBlock>
      <TwoColumnInfo>
        <TitleColumn>Definition: </TitleColumn>
        <p>GDP Growth means how quickly an economy is growing. </p>
      </TwoColumnInfo>
      <TwoColumnInfo>
        <TitleColumn>Notes: </TitleColumn>
        <p>
          The higher a country’s GDP is does not have a strong negative or
          positive correlation with that country’s GDP Growth.{' '}
        </p>
      </TwoColumnInfo>
      <TwoColumnInfo>
        <TitleColumn>Source: </TitleColumn>
        <p>World Bank. Where available, values from 2019-2020 averaged.</p>
      </TwoColumnInfo>
    </BackgroundInfoWrapper>
  );
}
