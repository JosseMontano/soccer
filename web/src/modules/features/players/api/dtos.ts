import * as yup from "yup";
import { PlayerDTOschema } from "../validations/PlayerDTO.schema";
export type PlayerDTO=yup.InferType<typeof PlayerDTOschema>
