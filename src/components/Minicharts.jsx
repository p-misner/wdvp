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

import Select from 'react-select';
import {
  Aqua,
  Carrot,
  lrgFontSize,
  Marigold,
  maxWidth,
  mediumWeight,
  Melon,
  PaleBlue,
  DarkTeal,
  DarkestBlue,
  Squash,
} from '../styleConstants';
import {
  countries,
  metricCategoryOptions,
  colorByOptions,
  xMetricOptions,
  customMetricOptions,
  defaultSelectedMetric,
} from './dataConstants';

import { BackgroundInfo, GINI, Legend } from './BespokeLargeCharts';

const SectionWrapper = styled.div``;

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  @media (max-width: 1420px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  @media (max-width: 1150px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 850px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 300px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;
const GridWrapperHoriz = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
  max-width: 1420px;
`;

const GridBox = styled.div`
  min-width: ${(props) =>
    props.pageLayout.layout === 'highlight' ? '200px' : '100px'};
  margin-right: ${(props) =>
    props.pageLayout.layout === 'highlight' ? '16px' : '0px'};
  height: 200px;
  position: relative;
  border: 1px solid black;
  border-radius: 8px 8px 0px 0px;
  padding: 0px 16px 16px 16px;
  & h3 {
    overflow-wrap: break-word;
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: left;
    text-transform: capitalize;
  }
  & h4 {
    overflow-wrap: break-word;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0em;
    opacity: 0.8;
    text-transform: capitalize;
  }
`;
const GraphContents = styled.div`
  max-height: 174px;
  position: relative;
  margin-left: -8px;

  &:hover {
    cursor: pointer;
  }

  .arrow {
    visibility: hidden;
    color: red;
    top: -8px;
    right: 0px;
  }

  &:hover .arrow {
    visibility: visible;
    font-size: 16px;
    font-weight: 600;
    width: 150px;
    color: rgba(0, 0, 0, 0.4);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
`;
const BottomInfoWrapper = styled.div`
  cursor: ${(props) => (props.open ? 'default' : 'n-resize')};
  border: 1px solid black;
  height: ${(props) => (props.open ? '180px' : '40px')};
  width: 100%;
  position: absolute;
  background: #ffd;
  left: 0px;
  bottom: 0px;
  border-radius: 8px 8px 0px 0px;
  button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 16px;
    visibility: ${(props) => (props.open ? 'visibile' : 'hidden')};
    position: absolute;
    right: 8px;
    top: 12px;
  }
`;
const BottomInfoContents = styled.div`
  width: 100%;
  h3 {
    margin: 12px;
    text-align: center;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
const ScatterSVG = styled.svg``;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
  justify-content: center;
`;
const ExpandArrow = styled.div`
  font-size: 48px;
  position: absolute;
  top: 0px;
  right: 4px;
`;

function ScatterplotGDP({ data, xMetric, colorBy, metricTitle }) {
  // TO DO: switch this out with dropdowns
  const width = 340;
  const height = 240;

  // TO DO: replace with spacing constants
  const margin = { top: 16, right: 10, bottom: 10, left: 40 };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const customMetric = customMetricOptions.find(
    (item) => item.metricTitle === metricTitle
  );
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
    .x(function (d) {
      return xScale(d[xMetric]);
    })
    .y(function (d) {
      return yScale(d.avgVal);
    })
    .size([width, height])
    .bandwidth(8)
    .thresholds(8)(data);
  const pathGenerator = geoPath();

  return (
    <div>
      <ScatterSVG
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
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
          <AxisBottom top={yMax} scale={xScale} numTicks={1} />
          <AxisLeft
            scale={yScale}
            hideAxisLine
            tickStroke="#e0e0e0"
            tickLabelProps={() => ({
              opacity: 0.6,
              fontSize: 16,
              textAnchor: 'end',
            })}
            numTicks={1}
          />
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
                    : colorBy === 'correlation'
                    ? '1'
                    : '3'
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
                strokeWidth="0.25"
              />
            ))}
          </g>
        </Group>
      </ScatterSVG>
    </div>
  );
}
ScatterplotGDP.propTypes = {
  data: PropTypes.array.isRequired,
  xMetric: PropTypes.string.isRequired,
  metricTitle: PropTypes.string.isRequired,
  colorBy: PropTypes.string.isRequired,
};

function PlotBox({ dataSeries, xMetric, setPageLayout, pageLayout, colorBy }) {
  const [open, setOpen] = useState(false);
  return (
    <GridBox pageLayout={pageLayout}>
      <GraphContents
        onClick={() => {
          setPageLayout({
            layout: 'highlight',
            selectedMetric: dataSeries,
          });
        }}
      >
        <ScatterplotGDP
          data={dataSeries.data}
          xMetric={xMetric}
          colorBy={colorBy}
          metricTitle={dataSeries.metricTitle}
        />

        <ExpandArrow className="arrow">Click to Expand</ExpandArrow>
      </GraphContents>
      <BottomInfoWrapper
        onClick={() => (open ? null : setOpen(true))}
        open={open}
      >
        <BottomInfoContents>
          <h3> {dataSeries.metricTitle} </h3>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            ⓧ
          </button>
        </BottomInfoContents>
      </BottomInfoWrapper>
    </GridBox>
  );
}
PlotBox.propTypes = {
  setPageLayout: PropTypes.func.isRequired,
  pageLayout: PropTypes.string.isRequired,
  xMetric: PropTypes.string.isRequired,
  colorBy: PropTypes.string.isRequired,
  dataSeries: PropTypes.shape({
    metricTitle: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    pageLayout: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
  }).isRequired,
};

const SideSideWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`;
const HeroChart = styled.div`
  h3 {
    font-size: ${lrgFontSize};
    font-weight: ${mediumWeight};
  }
`;
const LegendTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: capitalize;
`;
function LargeChart({ dataSeries, xMetric, colorBy, size }) {
  // first do fully for GINI
  const customMetric = customMetricOptions.find(
    (item) => item.metricTitle === dataSeries.metricTitle
  );
  return (
    <HeroChart>
      <h3>
        {customMetric?.seriesName
          ? customMetric.seriesName
          : dataSeries.metricTitle}
      </h3>
      <SideSideWrapper>
        <GINI
          customMetric={customMetric}
          data={dataSeries.data}
          xMetric={xMetric}
          colorBy={colorBy}
        />
        <Left>
          <Legend
            customMetric={customMetric}
            xMetric={xMetric}
            colorBy={colorBy}
          />
          <BackgroundInfo />
          <LegendTitle style={{ marginTop: '24px' }}>
            {' '}
            Top Ranked Countries
          </LegendTitle>
        </Left>
      </SideSideWrapper>
    </HeroChart>
  );
}
LargeChart.propTypes = {
  xMetric: PropTypes.string.isRequired,
  colorBy: PropTypes.string.isRequired,
  size: PropTypes.string,
  dataSeries: PropTypes.shape({
    metricTitle: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
  }).isRequired,
};
LargeChart.defaultProps = {
  size: 'small',
};

function ControlPanel({ controllersObj }) {
  return (
    <SelectWrapper>
      {controllersObj.map((x) => (
        <Select
          styles={{
            container: (baseStyles) => ({
              ...baseStyles,
              paddingRight: '16px',
              fontSize: '20px',
              minWidth: '250px',
            }),
          }}
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

function HighlightSection({
  setPageLayout,
  pageLayout,
  xMetric,
  theme,
  colorBy,
  data,
  presentWorldControllers,
}) {
  return (
    <SectionWrapper>
      <ControlPanel controllersObj={presentWorldControllers} />
      <LargeChart
        size="large"
        dataSeries={pageLayout.selectedMetric}
        key={pageLayout.selectedMetric.metricTitle}
        xMetric={xMetric}
        colorBy={colorBy}
        setPageLayout={setPageLayout}
        chartType={theme === 'presentWorld' ? 'scattercontour' : 'bubble'}
      />
      <button
        onClick={() => setPageLayout({ layout: 'grid', selectedMetric: {} })}
        type="button"
      >
        Return to Grid
      </button>
      <GridWrapperHoriz>
        {data.map((x) => (
          <PlotBox
            dataSeries={x}
            key={x.metricTitle}
            xMetric={xMetric}
            colorBy={colorBy}
            setPageLayout={setPageLayout}
            pageLayout={pageLayout}
          />
        ))}
      </GridWrapperHoriz>
    </SectionWrapper>
  );
}
HighlightSection.propTypes = {
  data: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
  setPageLayout: PropTypes.func.isRequired,
  colorBy: PropTypes.string.isRequired,
  xMetric: PropTypes.string.isRequired,
  presentWorldControllers: PropTypes.array.isRequired,
  pageLayout: PropTypes.shape({
    layout: PropTypes.oneOf(['highlight', 'grid']),
    selectedMetric: PropTypes.shape({
      metricTitle: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      notes: PropTypes.string.isRequired,
      data: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
};

function GridSection({
  setPageLayout,
  pageLayout,
  xMetric,
  theme,
  colorBy,
  data,
  presentWorldControllers,
}) {
  return (
    <SectionWrapper>
      <ControlPanel controllersObj={presentWorldControllers} />
      <GridWrapper>
        {data.map((x) => (
          <PlotBox
            dataSeries={x}
            key={x.metricTitle}
            xMetric={xMetric}
            colorBy={colorBy}
            setPageLayout={setPageLayout}
            pageLayout={pageLayout}
          />
        ))}
      </GridWrapper>
    </SectionWrapper>
  );
}
GridSection.propTypes = {
  data: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
  setPageLayout: PropTypes.func.isRequired,
  colorBy: PropTypes.string.isRequired,
  xMetric: PropTypes.string.isRequired,
  presentWorldControllers: PropTypes.array.isRequired,
  pageLayout: PropTypes.shape({
    layout: PropTypes.oneOf(['highlight', 'grid']),
    selectedMetric: PropTypes.shape({
      metricTitle: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      notes: PropTypes.string.isRequired,
      data: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
};

// eslint-disable-next-line import/prefer-default-export
export function PresentFutureDashboard({ data, theme }) {
  const [pageLayout, setPageLayout] = useState({
    layout: 'highlight',
    selectedMetric: defaultSelectedMetric,
  }); // grid or highlight

  const [xMetric, setXMetric] = useState('avgGDPpercapita');
  const [colorBy, setColorBy] = useState('ranking');

  const presentWorldControllers = [
    {
      defaultState: xMetric,
      options: xMetricOptions,
      changeState: setXMetric,
    },
    // {
    //   defaultState: metricCategory,
    //   options: metricCategoryOptions,
    //   changeState: setMetricCategory,
    // },
    {
      defaultState: colorBy,
      options: colorByOptions,
      changeState: setColorBy,
    },
  ];

  if (pageLayout.layout === 'highlight') {
    return (
      <HighlightSection
        pageLayout={pageLayout}
        theme={theme}
        setPageLayout={setPageLayout}
        data={data}
        colorBy={colorBy}
        xMetric={xMetric}
        presentWorldControllers={presentWorldControllers}
      />
    );
  }
  return (
    <GridSection
      pageLayout={pageLayout}
      theme={theme}
      setPageLayout={setPageLayout}
      data={data}
      colorBy={colorBy}
      xMetric={xMetric}
      presentWorldControllers={presentWorldControllers}
    />
  );
}
PresentFutureDashboard.propTypes = {
  data: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
};
