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
export const customMetrics = [
  {
    metricTitle: 'GINIindex',
    domain: [0, 100],
  },
  {
    metricTitle: 'happyplanetindex',
    domain: [0, 100],
  },
  {
    metricTitle: 'humandevelopmentindex',
    domain: [0, 1],
  },
  {
    metricTitle: 'sustainableeconomicdevelopmentassessmentSEDA',
    domain: [0, 100],
  },
  {
    metricTitle: 'GDPgrowthpercent',
    domain: [-15, 20],
  },
  {
    metricTitle: 'GDP',
    domain: [0, 23000],
  },
  {
    metricTitle: 'GDPpercapita',
    domain: [0, 125000],
  },
  {
    metricTitle: 'healthexpenditure',
    domain: [0, 15],
  },
  {
    metricTitle: 'healthexpenditureperperson',
    domain: [0, 12000],
  },
  {
    metricTitle: 'infantmortality',
    domain: [0, 100],
  },
  {
    metricTitle: 'maternalmortalityper100000livebirths',
    domain: [0, 1200],
  },
  {
    metricTitle: 'educationexpenditure',
    domain: [0, 20],
  },
  {
    metricTitle: 'educationGDP',
    domain: [0, 20],
  },
  {
    metricTitle: 'kidsoutofprimary',
    domain: [0, 100],
  },
  {
    metricTitle: 'unemployment',
    domain: [0, 30],
  },
  {
    metricTitle: 'ofpopulationinextremepoverty',
    domain: [0, 30],
  },
  {
    metricTitle: 'politicalrightsscore',
    domain: [0, 50],
  },
  {
    metricTitle: 'civillibertiesscore',
    domain: [0, 100],
  },
  {
    metricTitle: 'politcalstability',
    domain: [-3, 3],
  },
  {
    metricTitle: 'goveffectiveness',
    domain: [-3, 3],
  },
  {
    metricTitle: 'regulatoryquality',
    domain: [-3, 3],
  },
  {
    metricTitle: 'ruleoflaw',
    domain: [-3, 3],
  },
  {
    metricTitle: 'controlcorruption',
    domain: [-3, 3],
  },
  {
    metricTitle: 'judicialeffectiveness',
    domain: [0, 100],
  },
  {
    metricTitle: 'govintegrity',
    domain: [0, 100],
  },
  {
    metricTitle: 'economicfreedom',
    domain: [0, 100],
  },
  {
    metricTitle: 'finncialfreedom',
    domain: [0, 100],
  },
  {
    metricTitle: 'governmentexpenditure',
    domain: [0, 100],
  },
  {
    metricTitle: 'CO2eemissionspercapita',
    domain: [0, 40],
  },
  {
    metricTitle: 'renewableshare',
    domain: [0, 100],
  },
  {
    metricTitle: 'womenparliment',
    domain: [0, 70],
  },
  {
    metricTitle: 'militaryspending',
    domain: [0, 20],
  },
];
