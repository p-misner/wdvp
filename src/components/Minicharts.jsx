import React, { useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { contourDensity } from 'd3-contour';
import { geoPath } from 'd3-geo';

const gridWidth = 200;
const SectionWrapper = styled.div`
  //   width: 100%;
  background-color: ${(props) => props.color || 'rgba(255,0,0,.1)'};
  min-height: 600px;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
  //   grid-template-columns: repeat(auto-fit, ${gridWidth}px);
  grid-template-columns: repeat(5, minmax(0, 1fr));
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 400px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const GridBox = styled.div`
  //   min-width: ${gridWidth}px;
  //   height: 260px;
  background-color: white;
  border: 1px dashed gray;
  & h3 {
    overflow-wrap: break-word;
  }
`;

const ScatterSVG = styled.svg`
  background-color: rgba(0, 0, 0, 0.05);
`;

function ScatterplotGDP({ data }) {
  // TO DO: switch this out with dropdowns
  const metric = 'avgGDPpercapita';

  const width = 300;
  const height = 250;

  // TO DO: replace with spacing constants
  const margin = { top: 20, right: 10, bottom: 25, left: 40 };

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
      Math.min(...data.map((x) => x.avgVal)),
      Math.max(...data.map((x) => x.avgVal)) * 1,
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
      return yScale(d.avgVal);
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
  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);

  return (
    <div>
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
            numTicks={width > 520 ? 10 : 5}
          />
          <AxisLeft scale={yScale} hideAxisLine tickStroke="#e0e0e0" />
          <g className="contourGroup">
            {contour.map((x) => (
              <path
                key={`contour${x.avgVal}`}
                d={pathGenerator(x)}
                fill="rgba(255,0,0,0.2)"
              />
            ))}
          </g>
          {data.map((d) => (
            <circle
              key={d.country}
              cx={xScale(d[metric])}
              cy={yScale(d.avgVal)}
              r={Math.abs(d.avgVal) < 0.001 ? '0' : '1'}
              fill="blue"
              //   onMouseMove={handleMouseMove}
              onMouseMove={() => {
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                const top = yScale(d.avgVal) + margin.top;
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
          <p> GDP: {Math.round(tooltipData[metric]) / 1000}k</p>
          <p> value: {tooltipData.avgVal}</p>
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
