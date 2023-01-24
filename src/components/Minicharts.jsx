import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { contourDensity } from 'd3-contour';
import { geoPath } from 'd3-geo';

const SectionWrapper = styled.div`
  width: 100%;
  background-color: ${(props) => props.color || 'rgba(0,0,0,.1)'};
  min-height: 600px;
`;

const TooltipWrapper = styled.div`
  position: realtive;
`;
const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: 'rgba(53,71,125,0.8)',
  color: 'white',
  width: 152,
  height: 72,
  padding: 12,
};

const GridBox = styled.div`
  width: 316px;
  height: 356px;
  background-color: white;
  border: 1px dashed gray;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, 316px);
`;

const ScatterSVG = styled.svg`
  background-color: rgba(0, 0, 0, 0.2);
`;

function ScatterplotGDP({ data }) {
  // TO DO: switch this out with dropdowns
  const metric = 'avgGDPperCapita';

  // TO DO: width should be reflective of overall gridbox not static
  const width = 300;
  const height = 200;

  // TO DO: replace with spacing constants
  const margin = { top: 20, right: 10, bottom: 30, left: 50 };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const xScale = scaleLinear({
    domain: [
      Math.min(...data.map((x) => x[metric])),
      Math.max(...data.map((x) => x[metric])),
    ],
    range: [0, xMax],
    nice: true,
  });
  const yScale = scaleLinear({
    domain: [
      Math.min(...data.map((x) => x.value)),
      Math.max(...data.map((x) => x.value)) * 1,
    ],
    range: [yMax, 0],
    nice: true,
  });
  // contour
  const contour = contourDensity()
    .x(function (d) {
      return xScale(d[metric]);
    })
    .y(function (d) {
      return yScale(d.value);
    })
    .size([width, height])
    .bandwidth(5)
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
  const handleMouseMove = useCallback(
    (event) => {
      console.log(event);
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      const eventSvgCoords = localPoint(event);
      showTooltip({
        tooltipData: 'A',
        tooltipTop: eventSvgCoords?.y,
        tooltipLeft: eventSvgCoords?.x,
      });
    },
    [xScale, yScale, showTooltip]
  );

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);

  return (
    <div>
      <ScatterSVG width={width} height={height} ref={containerRef}>
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
            numTicks={width > 520 ? 10 : 5}
          />
          <AxisLeft scale={yScale} hideAxisLine tickStroke="#e0e0e0" />
          <g className="contourGroup">
            {contour.map((x) => (
              <path
                key={`contour${x.value}`}
                d={pathGenerator(x)}
                fill="rgba(255,0,0,0.2)"
              />
            ))}
          </g>
          {data.map((d) => (
            <circle
              key={d.country}
              cx={xScale(d[metric])}
              cy={yScale(d.value)}
              r="1"
              fill="blue"
              //   onMouseMove={handleMouseMove}
              onMouseMove={() => {
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                const top = yScale(d.value) + margin.top;
                const left = xScale(d[metric]) + margin.left;
                showTooltip({
                  tooltipData: d,
                  tooltipTop: top,
                  tooltipLeft: left,
                });
              }}
              onMouseLeave={handleMouseLeave}
            />
          ))}
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
          <p> GDP: {Math.round(tooltipData.avgGDPperCapita) / 1000}k</p>
          <p> value: {tooltipData.value}</p>
        </TooltipInPortal>
      )}
    </div>
  );
}

ScatterplotGDP.propTypes = {
  data: PropTypes.array,
};
ScatterplotGDP.defaultProps = {
  data: [
    { x: 10, y: 10 },
    { x: 20, y: 20 },
    { x: 30, y: 30 },
    { x: 40, y: 40 },
    { x: 50, y: 50 },
  ],
};

function PlotBox({ dataSeries }) {
  return (
    <GridBox>
      <h3>{dataSeries.metricTitle}</h3>
      <p> subtitle</p>
      <p> Trend Direction</p>
      <ScatterplotGDP data={dataSeries.data} />
    </GridBox>
  );
}
PlotBox.propTypes = {
  dataSeries: PropTypes.shape({
    metricTitle: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    dataYear: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
  }).isRequired,
};

export function PresentWorldSection({ data }) {
  return (
    <SectionWrapper>
      <GridWrapper>
        {data.map((x) => (
          <PlotBox dataSeries={x} key={x.metricTitle} />
        ))}
      </GridWrapper>
    </SectionWrapper>
  );
}

PresentWorldSection.propTypes = {
  data: PropTypes.array.isRequired,
};

export function PastDecadeSection() {
  return <SectionWrapper color="blue">Present World</SectionWrapper>;
}
export function CountryCompareSection() {
  return <SectionWrapper color="orange">Country Compare</SectionWrapper>;
}
