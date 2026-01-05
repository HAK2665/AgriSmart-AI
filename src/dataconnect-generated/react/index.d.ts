import { AddNewFarmData, AddNewFarmVariables, GetFarmsByUserIdData, GetFarmsByUserIdVariables, AddNewFieldData, AddNewFieldVariables, GetFieldsByFarmIdData, GetFieldsByFarmIdVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddNewFarm(options?: useDataConnectMutationOptions<AddNewFarmData, FirebaseError, AddNewFarmVariables>): UseDataConnectMutationResult<AddNewFarmData, AddNewFarmVariables>;
export function useAddNewFarm(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewFarmData, FirebaseError, AddNewFarmVariables>): UseDataConnectMutationResult<AddNewFarmData, AddNewFarmVariables>;

export function useGetFarmsByUserId(vars: GetFarmsByUserIdVariables, options?: useDataConnectQueryOptions<GetFarmsByUserIdData>): UseDataConnectQueryResult<GetFarmsByUserIdData, GetFarmsByUserIdVariables>;
export function useGetFarmsByUserId(dc: DataConnect, vars: GetFarmsByUserIdVariables, options?: useDataConnectQueryOptions<GetFarmsByUserIdData>): UseDataConnectQueryResult<GetFarmsByUserIdData, GetFarmsByUserIdVariables>;

export function useAddNewField(options?: useDataConnectMutationOptions<AddNewFieldData, FirebaseError, AddNewFieldVariables>): UseDataConnectMutationResult<AddNewFieldData, AddNewFieldVariables>;
export function useAddNewField(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewFieldData, FirebaseError, AddNewFieldVariables>): UseDataConnectMutationResult<AddNewFieldData, AddNewFieldVariables>;

export function useGetFieldsByFarmId(vars: GetFieldsByFarmIdVariables, options?: useDataConnectQueryOptions<GetFieldsByFarmIdData>): UseDataConnectQueryResult<GetFieldsByFarmIdData, GetFieldsByFarmIdVariables>;
export function useGetFieldsByFarmId(dc: DataConnect, vars: GetFieldsByFarmIdVariables, options?: useDataConnectQueryOptions<GetFieldsByFarmIdData>): UseDataConnectQueryResult<GetFieldsByFarmIdData, GetFieldsByFarmIdVariables>;
