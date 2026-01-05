import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'agrismartai',
  location: 'us-east4'
};

export const addNewFarmRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewFarm', inputVars);
}
addNewFarmRef.operationName = 'AddNewFarm';

export function addNewFarm(dcOrVars, vars) {
  return executeMutation(addNewFarmRef(dcOrVars, vars));
}

export const getFarmsByUserIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFarmsByUserId', inputVars);
}
getFarmsByUserIdRef.operationName = 'GetFarmsByUserId';

export function getFarmsByUserId(dcOrVars, vars) {
  return executeQuery(getFarmsByUserIdRef(dcOrVars, vars));
}

export const addNewFieldRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewField', inputVars);
}
addNewFieldRef.operationName = 'AddNewField';

export function addNewField(dcOrVars, vars) {
  return executeMutation(addNewFieldRef(dcOrVars, vars));
}

export const getFieldsByFarmIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFieldsByFarmId', inputVars);
}
getFieldsByFarmIdRef.operationName = 'GetFieldsByFarmId';

export function getFieldsByFarmId(dcOrVars, vars) {
  return executeQuery(getFieldsByFarmIdRef(dcOrVars, vars));
}

