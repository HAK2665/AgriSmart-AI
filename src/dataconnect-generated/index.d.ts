import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddNewFarmData {
  farm_insert: Farm_Key;
}

export interface AddNewFarmVariables {
  userId: UUIDString;
  name: string;
  description?: string | null;
  address?: string | null;
  primaryCrop?: string | null;
}

export interface AddNewFieldData {
  field_insert: Field_Key;
}

export interface AddNewFieldVariables {
  farmId: UUIDString;
  name: string;
  size: number;
  soilType?: string | null;
  currentCrop?: string | null;
  notes?: string | null;
}

export interface CropLog_Key {
  id: UUIDString;
  __typename?: 'CropLog_Key';
}

export interface Expense_Key {
  id: UUIDString;
  __typename?: 'Expense_Key';
}

export interface Farm_Key {
  id: UUIDString;
  __typename?: 'Farm_Key';
}

export interface Field_Key {
  id: UUIDString;
  __typename?: 'Field_Key';
}

export interface GetFarmsByUserIdData {
  farms: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    address?: string | null;
    primaryCrop?: string | null;
  } & Farm_Key)[];
}

export interface GetFarmsByUserIdVariables {
  userId: UUIDString;
}

export interface GetFieldsByFarmIdData {
  fields: ({
    id: UUIDString;
    name: string;
    size: number;
    soilType?: string | null;
    currentCrop?: string | null;
    notes?: string | null;
  } & Field_Key)[];
}

export interface GetFieldsByFarmIdVariables {
  farmId: UUIDString;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddNewFarmRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewFarmVariables): MutationRef<AddNewFarmData, AddNewFarmVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewFarmVariables): MutationRef<AddNewFarmData, AddNewFarmVariables>;
  operationName: string;
}
export const addNewFarmRef: AddNewFarmRef;

export function addNewFarm(vars: AddNewFarmVariables): MutationPromise<AddNewFarmData, AddNewFarmVariables>;
export function addNewFarm(dc: DataConnect, vars: AddNewFarmVariables): MutationPromise<AddNewFarmData, AddNewFarmVariables>;

interface GetFarmsByUserIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFarmsByUserIdVariables): QueryRef<GetFarmsByUserIdData, GetFarmsByUserIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFarmsByUserIdVariables): QueryRef<GetFarmsByUserIdData, GetFarmsByUserIdVariables>;
  operationName: string;
}
export const getFarmsByUserIdRef: GetFarmsByUserIdRef;

export function getFarmsByUserId(vars: GetFarmsByUserIdVariables): QueryPromise<GetFarmsByUserIdData, GetFarmsByUserIdVariables>;
export function getFarmsByUserId(dc: DataConnect, vars: GetFarmsByUserIdVariables): QueryPromise<GetFarmsByUserIdData, GetFarmsByUserIdVariables>;

interface AddNewFieldRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewFieldVariables): MutationRef<AddNewFieldData, AddNewFieldVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewFieldVariables): MutationRef<AddNewFieldData, AddNewFieldVariables>;
  operationName: string;
}
export const addNewFieldRef: AddNewFieldRef;

export function addNewField(vars: AddNewFieldVariables): MutationPromise<AddNewFieldData, AddNewFieldVariables>;
export function addNewField(dc: DataConnect, vars: AddNewFieldVariables): MutationPromise<AddNewFieldData, AddNewFieldVariables>;

interface GetFieldsByFarmIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFieldsByFarmIdVariables): QueryRef<GetFieldsByFarmIdData, GetFieldsByFarmIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFieldsByFarmIdVariables): QueryRef<GetFieldsByFarmIdData, GetFieldsByFarmIdVariables>;
  operationName: string;
}
export const getFieldsByFarmIdRef: GetFieldsByFarmIdRef;

export function getFieldsByFarmId(vars: GetFieldsByFarmIdVariables): QueryPromise<GetFieldsByFarmIdData, GetFieldsByFarmIdVariables>;
export function getFieldsByFarmId(dc: DataConnect, vars: GetFieldsByFarmIdVariables): QueryPromise<GetFieldsByFarmIdData, GetFieldsByFarmIdVariables>;

