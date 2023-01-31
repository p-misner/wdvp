import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { contourDensity } from 'd3-contour';
import { geoPath } from 'd3-geo';
import Select from 'react-select';
import {
  Aqua,
  Carrot,
  lrgFontSize,
  Marigold,
  mediumWeight,
  DarkTeal,
  DarkestBlue,
  Squash,
} from '../styleConstants';
import {
  colorByOptions,
  xMetricOptions,
  customMetricOptions,
  defaultSelectedMetric,
  countries,
} from './dataConstants';
import { tickFormatter, contourColor } from './utils';
import {
  BackgroundInfo,
  GINI,
  Legend,
  RankingInfo,
} from './BespokeLargeCharts';

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
x`;
const GridBox = styled.div`
  min-width: ${(props) =>
    props.pageLayout.layout === 'highlight' ? '200px' : '100px'};
  margin-right: ${(props) =>
    props.pageLayout.layout === 'highlight' ? '16px' : '0px'};
  height: 200px;
  position: relative;
  border: 1px solid #000531;
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
  border: 1px solid #000531;
  height: ${(props) => (props.open ? '180px' : '40px')};
  width: 100%;
  position: absolute;
  background: #fff;
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

const ExpandArrow = styled.div`
  font-size: 48px;
  position: absolute;
  top: 0px;
  right: 4px;
`;
function ScatterplotGDP({
  data,
  xMetric,
  colorBy,
  selectedCountry,
  metricTitle,
  customMetric,
}) {
  const similarCountries = ['China', 'United States', 'India', 'Argentina'];
  const allLabeledCountries = [
    'China',
    'United States',
    'India',
    'Argentina',
  ].concat([selectedCountry.value]);

  // TO DO: switch this out with dropdowns
  const width = 340;
  const height = 240;

  // TO DO: replace with spacing constants
  const margin = { top: 16, right: 10, bottom: 10, left: 40 };

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
    .unknown('#000531');

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
            numTicks={2}
            stroke="#999BAD"
            strokeWidth="2px"
            tickStroke="#B3B4C1"
            tickLabelProps={() => ({
              opacity: 0.6,
              fontSize: 16,
              textAnchor: 'middle',
            })}
            tickFormat={(value) => tickFormatter(value)}
          />
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
            numTicks={2}
            tickFormat={(value) => tickFormatter(value)}
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
                    stroke={contourColor({
                      xMetric,
                      customMetric,
                    })}
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
                  Math.abs(d.avgVal) < 0.0001 || Math.abs(d[xMetric]) < 0.0001
                    ? '0'
                    : d.country === selectedCountry
                    ? '20'
                    : colorBy === 'Correlation'
                    ? '1'
                    : '3'
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
                fillOpacity="1"
                stroke="#000531"
                strokeWidth={d.country === selectedCountry ? '2' : '0.25'}
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
  selectedCountry: PropTypes.string.isRequired,
  customMetric: PropTypes.object.isRequired,
};

function PlotBox({
  dataSeries,
  xMetric,
  selectedCountry,
  setPageLayout,
  pageLayout,
  colorBy,
}) {
  const [open, setOpen] = useState(false);

  const customMetric = customMetricOptions.find(
    (item) => item.metricTitle === dataSeries.metricTitle
  );

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
          selectedCountry={selectedCountry}
          metricTitle={dataSeries.metricTitle}
          customMetric={customMetric}
        />

        <ExpandArrow className="arrow">Click to Expand</ExpandArrow>
      </GraphContents>
      <BottomInfoWrapper
        onClick={() => (open ? null : setOpen(true))}
        open={open}
      >
        <BottomInfoContents>
          <h3>
            {' '}
            {customMetric?.seriesName
              ? customMetric.seriesName
              : dataSeries.metricTitle}{' '}
          </h3>
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
  selectedCountry: PropTypes.string.isRequired,
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
  max-width: 1350px;
  margin: 0px auto;
  @media (max-width: 1000px) {
    flex-flow: column wrap;
  }
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`;
const HeroChart = styled.div`
  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

function LargeChart({ dataSeries, xMetric, colorBy, selectedCountry, size }) {
  // first do fully for GINI
  const customMetric = customMetricOptions.find(
    (item) => item.metricTitle === dataSeries.metricTitle
  );
  function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      // Add event listener
      window.addEventListener('resize', handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }
  const windowSize = useWindowSize();
  return (
    <HeroChart>
      <SideSideWrapper>
        <GINI
          windowSize={windowSize}
          customMetric={customMetric}
          data={dataSeries.data}
          xMetric={xMetric}
          colorBy={colorBy}
          selectedCountry={selectedCountry}
        />
        <Left>
          <Legend
            customMetric={customMetric}
            xMetric={xMetric}
            colorBy={colorBy}
          />
          {colorBy === 'Correlation' && (
            <BackgroundInfo xMetric={xMetric} customMetric={customMetric} />
          )}
          {colorBy === 'Ranking' && windowSize.width > 1300 && (
            <RankingInfo
              selectedCountry={selectedCountry}
              customMetric={customMetric}
              rankingData={dataSeries.data
                .filter(
                  (x) =>
                    x.avgVal !== null &&
                    (Math.abs(x.avgVal) > 0.001 || Math.abs(x[xMetric]) > 0.001)
                )
                .sort((a, b) => b.avgVal - a.avgVal)
                .map((x, i) => ({
                  country: x.country,
                  avgVal: x.avgVal,
                  rank: i + 1,
                }))}
            />
          )}
        </Left>
      </SideSideWrapper>
      {colorBy === 'Ranking' && windowSize.width <= 1300 && (
        <RankingInfo
          selectedCountry={selectedCountry}
          customMetric={customMetric}
          position="bottom"
          rankingData={dataSeries.data
            .filter(
              (x) =>
                x.avgVal !== null &&
                (Math.abs(x.avgVal) > 0.001 || Math.abs(x[xMetric]) > 0.001)
            )
            .sort((a, b) => b.avgVal - a.avgVal)
            .map((x, i) => ({
              country: x.country,
              avgVal: x.avgVal,
              rank: i + 1,
            }))}
        />
      )}
    </HeroChart>
  );
}
LargeChart.propTypes = {
  xMetric: PropTypes.string.isRequired,
  colorBy: PropTypes.string.isRequired,
  selectedCountry: PropTypes.string.isRequired,
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

const SelectWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 24px;
  justify-content: space-around;
  // background: red;
  @media (max-width: 900px) {
    flex-flow: row wrap;
  }
`;
const LabelDropdownWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #000531;
  // background: orange;
  p {
    text-align: left;
    margin-right: 4px;
    opacity: 0.7;
    font-weight: 500;
    white-space: nowrap;
  }
  @media (max-width: 900px) {
    margin-bottom: 8px;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }
  @media (max-width: 590px) {
    p {
      white-space: normal;
      flex-flow: row wrap;
    }
    .leftAlignDropdown {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: center;
    }
  }
`;
function ControlPanel({ controllersObj }) {
  return (
    <SelectWrapper>
      {controllersObj.map((x) => (
        <LabelDropdownWrapper key={x.defaultState}>
          <div className="leftAlignDropdown">
            <p> {x.dropdownLabel.toUpperCase()}:</p>
            <Select
              styles={{
                container: (baseStyles) => ({
                  ...baseStyles,
                  color: '',
                  paddingRight: '16px',
                  fontSize: '18px',
                  minWidth: '250px',
                }),
                option: (provided) => ({
                  ...provided,
                  color: '#000531',
                }),
                control: (provided) => ({
                  ...provided,
                  color: '#000531',
                  borderColor: '#B3B4C1',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: '#000531',
                }),
              }}
              defaultValue={{ value: x.defaultState, label: x.defaultState }}
              options={x.options}
              onChange={(a) => x.changeState(a.value)}
            />
          </div>
        </LabelDropdownWrapper>
      ))}
    </SelectWrapper>
  );
}
ControlPanel.propTypes = {
  controllersObj: PropTypes.array.isRequired,
};

const HighlightChartTitle = styled.h3`
  color: #000531;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  margin: 0px 8px 12px 12px;
`;
function HighlightSection({
  setPageLayout,
  pageLayout,
  xMetric,
  selectedCountry,
  theme,
  colorBy,
  data,
  presentWorldControllers,
}) {
  const customMetric = customMetricOptions.find(
    (item) => item.metricTitle === pageLayout.selectedMetric.metricTitle
  );
  return (
    <SectionWrapper>
      <HighlightChartTitle>
        {customMetric
          ? customMetric.seriesName
          : pageLayout.selectedMetric.metricTitle}
      </HighlightChartTitle>
      <ControlPanel controllersObj={presentWorldControllers} />
      <LargeChart
        size="large"
        dataSeries={pageLayout.selectedMetric}
        key={pageLayout.selectedMetric.metricTitle}
        xMetric={xMetric}
        colorBy={colorBy}
        selectedCountry={selectedCountry}
        setPageLayout={setPageLayout}
        chartType={theme === 'presentWorld' ? 'scattercontour' : 'bubble'}
      />
      <button
        onClick={() => setPageLayout({ layout: 'grid', selectedMetric: {} })}
        type="button"
        style={{
          textAlign: 'right',
          color: '#fff',
          border: '1px solid #000531',
          padding: '6px 12px',
          background: '#000531',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        See as Grid
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
            selectedCountry={selectedCountry}
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
  selectedCountry: PropTypes.string.isRequired,
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
  selectedCountry,
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
            selectedCountry={selectedCountry}
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
  selectedCountry: PropTypes.string.isRequired,
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

const DashboardWrapper = styled.div`
  padding: 32px;
  background: white;
  border: 2px solid #000531;
  border-radius: 8px;
  @media (max-width: 600px) {
    padding: 16px;
  }
  margin: 0px;
`;
const DashboardTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px dashed #000531;
  padding-bottom: 24px;
  margin-bottom: 24px;
  color: #000531;
  // background: red;
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
// eslint-disable-next-line import/prefer-default-export
export function PresentFutureDashboard({ data, theme }) {
  const [pageLayout, setPageLayout] = useState({
    layout: 'highlight',
    selectedMetric: defaultSelectedMetric,
  }); // grid or highlight

  const [xMetric, setXMetric] = useState('avgGDPpercapita');
  const [colorBy, setColorBy] = useState('Ranking');
  const [selectedCountry, setSelectedCountry] = useState('None');

  const presentWorldControllers = [
    {
      defaultState: xMetric,
      options: xMetricOptions,
      changeState: setXMetric,
      dropdownLabel: 'Compare Metric To',
    },
    {
      defaultState: colorBy,
      options: colorByOptions,
      changeState: setColorBy,
      dropdownLabel: 'Color Chart By',
    },
    {
      defaultState: selectedCountry,
      dropdownLabel: 'Highlight a Country',
      options: countries.map((x) => ({ value: x, label: x })),
      changeState: setSelectedCountry,
    },
  ];

  return (
    <DashboardWrapper>
      <DashboardTitleWrapper>
        <h2>Dashboard of the Present Future</h2>
        <p>
          Understand and explore how 172 listed countries are doing on 32
          different metrics and how specific countries rank against the rest of
          the world.
        </p>
      </DashboardTitleWrapper>
      {pageLayout.layout === 'highlight' ? (
        <HighlightSection
          pageLayout={pageLayout}
          theme={theme}
          setPageLayout={setPageLayout}
          data={data}
          colorBy={colorBy}
          xMetric={xMetric}
          selectedCountry={selectedCountry}
          presentWorldControllers={presentWorldControllers}
        />
      ) : (
        <GridSection
          pageLayout={pageLayout}
          theme={theme}
          setPageLayout={setPageLayout}
          data={data}
          colorBy={colorBy}
          xMetric={xMetric}
          selectedCountry={selectedCountry}
          presentWorldControllers={presentWorldControllers}
        />
      )}
    </DashboardWrapper>
  );
}
PresentFutureDashboard.propTypes = {
  data: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
};
