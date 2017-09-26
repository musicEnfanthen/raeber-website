export const globalSearchVariableService = Object.freeze({
  initialVocabulary: 'http://www.knora.org/ontology/kuno-raeber',
  API_URL: 'http://knora.nie-ine.ch/v1',
  resourceTypesPath:  '/resourcetypes?vocabulary=',
  propertyListsQuery: '/propertylists?restype=',
  extendedSearch: '/search/?searchtype=extended&filter_by_restype=',
  extendedProperty: '&property_id=',
  compareOperator: '&compop=',
  searchval: '&searchval='
  //... more of your variables
});