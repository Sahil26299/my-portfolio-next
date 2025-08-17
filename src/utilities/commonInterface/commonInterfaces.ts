// import { Dayjs } from "dayjs";
import React from "react";
/**
 * Form and Input events
 */
export type inputChangeEventType = React.ChangeEvent<HTMLInputElement>;
export type formSubmitEventType = React.FormEvent<HTMLFormElement>;

/**
 * Axios API Client: Types for custom responses and payloads
 */
export type ApiResponse<T> = {
  data: T;
  status: number;
};
export type CustomResponse<DataType> = {
  data: DataType;
  status: number;
};

/**
 * Generic Interfaces
 */
export interface GenericObjectInterface {
  [key: string]: any;
}
export type ArrayOfStringType = string[];

export interface chatRecords {
  user: "user" | "bot";
  message: string;
  isLoading: boolean;
  isError: boolean;
}
