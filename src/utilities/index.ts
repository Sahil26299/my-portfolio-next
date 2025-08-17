import { poppins } from "./themes/font";
import {
  formSubmitEventType,
  inputChangeEventType,
  ArrayOfStringType,
  GenericObjectInterface,
  chatRecords,
} from "./commonInterface/commonInterfaces";
import details from "./json/details.json";
import {
  embedChunksIntoVectors,
  fetchMatchingEmbeddings,
  parseDataIntoChunks,
  storeVectorsIntoVectorStore,
} from "./commonFunctions/commonFunctions";
import {
  keys,
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
} from "./storage/sessionStorageUtils";

export {
  poppins,
  details,
  embedChunksIntoVectors,
  fetchMatchingEmbeddings,
  parseDataIntoChunks,
  storeVectorsIntoVectorStore,
  keys,
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
};
export type {
  chatRecords,
  formSubmitEventType,
  inputChangeEventType,
  ArrayOfStringType,
  GenericObjectInterface,
};
