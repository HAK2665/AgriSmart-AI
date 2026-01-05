const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'agrismartai',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const addNewFarmRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewFarm', inputVars);
}
addNewFarmRef.operationName = 'AddNewFarm';
exports.addNewFarmRef = addNewFarmRef;

exports.addNewFarm = function addNewFarm(dcOrVars, vars) {
  return executeMutation(addNewFarmRef(dcOrVars, vars));
};

const getFarmsByUserIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFarmsByUserId', inputVars);
}
getFarmsByUserIdRef.operationName = 'GetFarmsByUserId';
exports.getFarmsByUserIdRef = getFarmsByUserIdRef;

exports.getFarmsByUserId = function getFarmsByUserId(dcOrVars, vars) {
  return executeQuery(getFarmsByUserIdRef(dcOrVars, vars));
};

const addNewFieldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewField', inputVars);
}
addNewFieldRef.operationName = 'AddNewField';
exports.addNewFieldRef = addNewFieldRef;

exports.addNewField = function addNewField(dcOrVars, vars) {
  return executeMutation(addNewFieldRef(dcOrVars, vars));
};

const getFieldsByFarmIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFieldsByFarmId', inputVars);
}
getFieldsByFarmIdRef.operationName = 'GetFieldsByFarmId';
exports.getFieldsByFarmIdRef = getFieldsByFarmIdRef;

exports.getFieldsByFarmId = function getFieldsByFarmId(dcOrVars, vars) {
  return executeQuery(getFieldsByFarmIdRef(dcOrVars, vars));
};
