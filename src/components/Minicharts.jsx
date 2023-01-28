import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { contourDensity } from 'd3-contour';
import { geoPath } from 'd3-geo';

import Select from 'react-select';

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
const GridWrapperHoriz = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
`;

const GridBox = styled.div`
  min-width: 100px;
  position: relative;
  background-color: white;
  border: 1px dashed gray;
  & h3 {
    overflow-wrap: break-word;
  }
  .arrow {
    visibility: hidden;
    color: red;
  }
  &:hover .arrow {
    visibility: visible;
    color: blue;
  }
`;

const ScatterSVG = styled.svg`
  background-color: rgba(0, 0, 0, 0.05);
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px;
`;
const ExpandArrow = styled.div`
  font-size: 48px;
  position: absolute;
  top: 0px;
  right: 4px;
`;

// Dropdown Options
const xMetricOptions = [
  { value: 'avgGDPpercapita', label: 'Average GDP Per Capita' },
  { value: 'latestGDPpercapita', label: 'Latest GDP Per Capita' },
  { value: 'GINI', label: 'Gini Inequality Index' },
  { value: 'avgHappyPlanet', label: 'Average Happy Planet Index' },
  { value: 'SEDA', label: 'Sustainable Development Index' },
];
const countries = [
  { value: 'Australia', label: 'Australia' },
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Angola', label: 'Angola' },
  { value: 'China', label: 'China' },
];
const metricCategoryOptions = [
  { value: 'allmetrics', label: 'All Metrics' },
  { value: 'economic', label: 'Economic Metrics' },
  { value: 'health', label: 'Health Metrics' },
  { value: 'sustainability', label: 'Sustainability Metrics' },
];
const colorByOptions = [
  { value: 'trend', label: 'Color by: Trend' },
  { value: 'continent', label: 'Color by: Continent' },
  { value: 'income', label: 'Color by: Income' },
];

function ScatterplotGDP({ data, xMetric, size }) {
  // TO DO: switch this out with dropdowns

  const width = size === 'large' ? 700 : 300;
  const height = size === 'large' ? 400 : 250;

  // TO DO: replace with spacing constants
  const margin = { top: 20, right: 10, bottom: 25, left: 40 };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

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
      return xScale(d[xMetric]);
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
            {contour.map((x, i) => (
              <path
                // eslint-disable-next-line react/no-array-index-key
                key={`contour${i}}`}
                d={pathGenerator(x)}
                fill="rgba(255,0,0,0.2)"
              />
            ))}
          </g>
          {data.map((d) => (
            <circle
              key={d.country}
              cx={xScale(d[xMetric])}
              cy={yScale(d.avgVal)}
              r={
                Math.abs(d.avgVal) < 0.001 || Math.abs(d[xMetric]) < 0.001
                  ? '0'
                  : size === 'large'
                  ? '3'
                  : '1'
              }
              fill="blue"
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
          <p> GDP: {Math.round(tooltipData[xMetric]) / 1000}k</p>
          <p> value: {tooltipData.avgVal}</p>
        </TooltipInPortal>
      )}
    </div>
  );
}
ScatterplotGDP.propTypes = {
  data: PropTypes.array,
  xMetric: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
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

function CountryBubble({ data, xMetric, size }) {
  const width = size === 'large' ? 700 : 300;
  const height = size === 'large' ? 400 : 250;

  // TO DO: replace with spacing constants
  const margin = { top: 20, right: 10, bottom: 25, left: 40 };
  const radius = 3;
  const bubblePadding = 2;

  //   .force('x', forceX())
  //   .force('y', forceY());

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const xScale = scaleLinear({
    domain: [0, 1],
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

  // console.log(simulation.nodes(data).nodes());

  // TOOLTIP
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip, // on hover we will call this function to show tooltip
    hideTooltip, // and this one to hide it
  } = useTooltip();

  const { countryRef, TooltipInPortal } = useTooltipInPortal({
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
      {xMetric}
      <ScatterSVG
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        ref={countryRef}
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
          <AxisLeft scale={yScale} hideAxisLine tickStroke="#e0e0e0" />{' '}
        </Group>
        <g>
          {data.map((d) => (
            <circle
              key={d.country}
              cx={xScale(0.5) + margin.left}
              cy={yScale(d.avgVal) + margin.top}
              r={
                Math.abs(d.avgVal) < 0.001 || Math.abs(d[xMetric]) < 0.001
                  ? '0'
                  : d.country === xMetric
                  ? '10'
                  : size === 'large'
                  ? '3'
                  : '1'
              }
              fill="blue"
              //   onMouseMove={handleMouseMove}
              onMouseMove={() => {
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                const top = yScale(d.avgVal) + margin.top;
                const left = xScale(0.5) + margin.left;
                showTooltip({
                  tooltipData: d,
                  tooltipTop: top + 600,
                  tooltipLeft: left,
                });
              }}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </g>
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
CountryBubble.propTypes = {
  data: PropTypes.array.isRequired,
  xMetric: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
};

function PlotBox({ dataSeries, xMetric, setPageLayout, size, chartType }) {
  return (
    <GridBox
      onClick={() => {
        setPageLayout({
          layout: 'highlight',
          selectedMetric: dataSeries,
        });
      }}
    >
      <h3>{dataSeries.metricTitle}</h3>
      {chartType === 'bubble' ? (
        <CountryBubble data={dataSeries.data} xMetric={xMetric} size={size} />
      ) : (
        <ScatterplotGDP data={dataSeries.data} xMetric={xMetric} size={size} />
      )}
      <ExpandArrow className="arrow">⬈</ExpandArrow>
    </GridBox>
  );
}
PlotBox.propTypes = {
  setPageLayout: PropTypes.func.isRequired,
  xMetric: PropTypes.string.isRequired,
  chartType: PropTypes.string.isRequired,
  size: PropTypes.string,
  dataSeries: PropTypes.shape({
    metricTitle: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    // dataYear: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
  }).isRequired,
};
PlotBox.defaultProps = {
  size: 'small',
};

function ControlPanel({ controllersObj }) {
  return (
    <SelectWrapper>
      {controllersObj.map((x) => (
        <Select
          key={x.defaultState}
          defaultValue={{ value: x.defaultState, label: x.defaultState }}
          options={x.options}
          onChange={(a) => x.changeState(a.value)}
        />
      ))}
    </SelectWrapper>
  );
}

ControlPanel.propTypes = {
  controllersObj: PropTypes.array.isRequired,
};

export function MultiCharts({ data, theme }) {
  const [pageLayout, setPageLayout] = useState({
    layout: 'grid',
    selectedMetric: {},
  }); // grid or highlight

  const [xMetric, setXMetric] = useState('avgGDPpercapita');
  const [metricCategory, setMetricCategory] = useState('allmetrics');
  const [colorBy, setColorBy] = useState('trend');
  const [country, setCountry] = useState('Australia');

  const presentWorldControllers = [
    {
      defaultState: xMetric,
      options: xMetricOptions,
      changeState: setXMetric,
    },
    {
      defaultState: metricCategory,
      options: metricCategoryOptions,
      changeState: setMetricCategory,
    },
    {
      defaultState: colorBy,
      options: colorByOptions,
      changeState: setColorBy,
    },
  ];
  const countryCompareControllers = [
    {
      defaultState: 'Australia',
      options: countries,
      changeState: setCountry,
    },
  ];

  if (pageLayout.layout === 'highlight') {
    return (
      <SectionWrapper>
        <button
          onClick={() => setPageLayout({ layout: 'grid', selectedMetric: {} })}
          type="button"
        >
          Return to Grid
        </button>

        {theme === 'presentWorld' ? (
          <ControlPanel controllersObj={presentWorldControllers} />
        ) : (
          <ControlPanel controllersObj={countryCompareControllers} />
        )}

        <PlotBox
          size="large"
          dataSeries={pageLayout.selectedMetric}
          key={pageLayout.selectedMetric.metricTitle}
          xMetric={theme === 'presentWorld' ? xMetric : country}
          setPageLayout={setPageLayout}
          chartType={theme === 'presentWorld' ? 'scattercontour' : 'bubble'}
        />
        <GridWrapperHoriz>
          {data.map((x) => (
            <PlotBox
              dataSeries={x}
              key={x.metricTitle}
              xMetric={theme === 'presentWorld' ? xMetric : country}
              setPageLayout={setPageLayout}
              chartType={theme === 'presentWorld' ? 'scattercontour' : 'bubble'}
            />
          ))}
        </GridWrapperHoriz>
      </SectionWrapper>
    );
  }
  return (
    <SectionWrapper>
      {theme === 'presentWorld' ? (
        <ControlPanel controllersObj={presentWorldControllers} />
      ) : (
        <ControlPanel controllersObj={countryCompareControllers} />
      )}

      <GridWrapper>
        {data.map((x) => (
          <PlotBox
            dataSeries={x}
            key={x.metricTitle}
            xMetric={theme === 'presentWorld' ? xMetric : country}
            setPageLayout={setPageLayout}
            chartType={theme === 'presentWorld' ? 'scattercontour' : 'bubble'}
          />
        ))}
      </GridWrapper>
    </SectionWrapper>
  );
}

MultiCharts.propTypes = {
  data: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
};

export function PastDecadeSection() {
  return <SectionWrapper color="blue">Present World</SectionWrapper>;
}
