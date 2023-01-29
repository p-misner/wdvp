export const countries = [
  { value: 'Australia', label: 'Australia' },
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Angola', label: 'Angola' },
  { value: 'China', label: 'China' },
];

// Dropdown Options
export const xMetricOptions = [
  { value: 'avgGDPpercapita', label: 'Average GDP Per Capita' },
  { value: 'latestGDPpercapita', label: 'Latest GDP Per Capita' },
  { value: 'GINI', label: 'Gini Inequality Index' },
  { value: 'avgHappyPlanet', label: 'Average Happy Planet Index' },
  { value: 'SEDA', label: 'Sustainable Development Index' },
];
export const metricCategoryOptions = [
  { value: 'allmetrics', label: 'All Metrics' },
  { value: 'economic', label: 'Economic Metrics' },
  { value: 'health', label: 'Health Metrics' },
  { value: 'sustainability', label: 'Sustainability Metrics' },
];
export const colorByOptions = [
  { value: 'correlation', label: 'Color by: Correlation' },
  { value: 'ranking', label: 'Color by: Ranking' },
  { value: 'continent', label: 'Color by: Continent' },
  { value: 'income', label: 'Color by: Income' },
];

// Custom Metrics
export const customMetricOptions = [
  {
    metricTitle: 'GINIindex',
    seriesName: 'GINI Index',
    domain: [0, 100],
    lowerText: 'LESS EQUAL',
    upperText: 'MORE EQUAL',
  },
  {
    metricTitle: 'happyplanetindex',
    seriesName: 'Happy Planet Index',
    domain: [0, 100],
    upperText: 'HAPPIER',
  },
  {
    metricTitle: 'humandevelopmentindex',
    seriesName: 'Human Development Index',
    domain: [0, 1],
    controlPosition: 'bottom',
    lowerText: 'LESS DEVELOPED',
    upperText: 'MORE DEVELOPED',
  },
  {
    metricTitle: 'sustainableeconomicdevelopmentassessmentSEDA',
    seriesName: 'Sustainable Economic Development Assessment',
    domain: [0, 100],
    controlPosition: 'bottom',
    upperText: 'MORE SUSTAINABLE',
    lowerText: 'LESS SUSTAINABLE',
  },
  {
    metricTitle: 'GDPgrowthpercent',
    seriesName: 'Percent GDP Growth',
    domain: [-15, 20],
    upperText: 'ECONOMY GROWING',
    lowerText: 'ECONOMY SHRINKING',
  },
  {
    metricTitle: 'GDP',
    seriesName: 'Gross Domestic Product (GDP)',
    domain: [0, 23000],
    upperText: 'WEALTHIER',
  },
  {
    metricTitle: 'GDPpercapita',
    seriesName: 'GDP Per Capita',
    domain: [0, 125000],
    upperText: 'WEALTHIER',
  },
  {
    metricTitle: 'healthexpenditure',
    seriesName: 'Health Expenditure',
    domain: [0, 15],
  },
  {
    metricTitle: 'healthexpenditureperperson',
    seriesName: 'Health Expenditure Per Capita',
    domain: [0, 12000],
  },
  {
    metricTitle: 'infantmortality',
    seriesName: 'Infant Mortality',
    domain: [0, 100],
    upperText: 'HIGHER MORTALITY',
  },
  {
    metricTitle: 'maternalmortalityper100000livebirths',
    seriesName: 'Maternal Mortality',
    domain: [0, 1200],
    upperText: 'HIGHER MORTALITY',
  },
  {
    metricTitle: 'educationexpenditure',
    seriesName: 'Percent of GDP Spent on Education',
    domain: [0, 20],
  },
  {
    metricTitle: 'educationGDP',
    domain: [0, 20],
  },
  {
    metricTitle: 'kidsoutofprimary',
    seriesName: 'Percent of Eligible Kids not in Primary School',
    domain: [0, 100],
    upperText: 'MORE KIDS OUT OF SCHOOL',
  },
  {
    metricTitle: 'unemployment',
    seriesName: 'Percent Unemployment',
    domain: [0, 30],
  },
  {
    metricTitle: 'ofpopulationinextremepoverty',
    seriesName: 'Percent of Population in Extreme Poverity',
    domain: [0, 30],
    upperText: 'MORE IN EXTREME POVERTY ',
  },
  {
    metricTitle: 'ofpopulationwithaccesstoelectricity',
    seriesName: 'Percent of Population with Access to Electricity',
    domain: [0, 100],
    controlPosition: 'bottom',
    lowerText: 'LESS ACCESS ',
  },
  {
    metricTitle: 'politicalrightsscore',
    seriesName: 'Political Rights Score',
    domain: [0, 50],
  },
  {
    metricTitle: 'civillibertiesscore',
    seriesName: 'Civil Liberties Score',
    domain: [0, 100],
  },
  {
    metricTitle: 'politcalstability',
    seriesName: 'Political Stability and Absence of Violence',
    domain: [-3, 2],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'goveffectiveness',
    seriesName: 'Government Effectiveness',

    domain: [-3, 3],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'regulatoryquality',
    seriesName: 'Regulatory Quality',
    domain: [-3, 2.5],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'ruleoflaw',
    seriesName: 'Rule of Law',
    domain: [-3, 2.5],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'controlcorruption',
    seriesName: 'Control of Corruption',
    domain: [-3, 2.5],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'judicialeffectiveness',
    seriesName: 'Judicial Effectiveness',
    domain: [0, 100],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'govintegrity',
    seriesName: 'Goernment Integrity',
    domain: [0, 100],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'economicfreedom',
    seriesName: 'Economic Freedom',
    domain: [0, 100],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'finncialfreedom',
    seriesName: 'Financial Freedom',
    domain: [0, 100],
    controlPosition: 'bottom',
  },
  {
    metricTitle: 'governmentexpenditure',
    seriesName: 'Government Expenditure',
    domain: [0, 100],
  },
  {
    metricTitle: 'CO2eemissionspercapita',
    seriesName: 'CO2 Emissions per Capita',
    domain: [0, 40],
  },
  {
    metricTitle: 'renewableshare',
    seriesName: 'Share of Electricity from Renewables Generation',
    domain: [0, 100],
  },
  {
    metricTitle: 'womenparliment',
    seriesName: 'Percent of Seats Held by Women in National Parliaments',
    domain: [0, 70],
  },
  {
    metricTitle: 'militaryspending',
    seriesName: 'Military Spending as Percent of GDP',
    domain: [0, 20],
  },
];
