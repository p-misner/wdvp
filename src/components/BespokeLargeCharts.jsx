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
import { customMetrics } from './dataConstants';

const ScatterSVG = styled.svg``;
const InChartButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
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

function tickFormatter(value) {
  if (value > 1000) {
    return `${value / 1000}k`;
  }
  return value;
}
// eslint-disable-next-line import/prefer-default-export
export function GINI({ data, xMetric, colorBy, chartTitle }) {
  const [scaleByPop, setScaleByPop] = useState(false);

  const width = 700;
  const height = 500;

  // TO DO: replace with spacing constants
  const margin = { top: 20, right: 10, bottom: 60, left: 52 };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // domain changes depending on metric (not based on min max)
  const metricDomain = customMetrics.find(
    (item) => item.metricTitle === chartTitle
  )?.domain;

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
    domain: metricDomain,
    range: [yMax, 0],
    nice: true,
  });
  const popScale = scaleLinear({
    domain: [20, 1386000000],
    range: [2, 60],
    nice: true,
  });
  const rankingScale = scaleQuantile()
    .domain([
      Math.min(...data.map((x) => x.avgVal)),
      Math.max(...data.map((x) => x.avgVal)),
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

  let tooltipTimeout;
  // event handlers
  function HoverStyleReset(e) {
    e.target.style.strokeWidth = '1';
    // e.target.style.stroke = 'black';
    // e.target.style.fill = 'black';
  }
  const TooltipTimer = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);

  return (
    <div style={{ marginBottom: 64, position: 'relative', maxWidth: '700px' }}>
      <InChartButtonWrapper>
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
          <g className="labels">a</g>
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
  chartTitle: PropTypes.string.isRequired,
  colorBy: PropTypes.string.isRequired,
};
