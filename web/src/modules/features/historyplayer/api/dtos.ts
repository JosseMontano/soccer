import * as yup from "yup";
import { HistoryplayerDTOschema } from "../validations/HistoryplayerDTO.schema";
export type HistoryplayerDTO=yup.InferType<typeof HistoryplayerDTOschema>
