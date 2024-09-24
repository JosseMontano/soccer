import * as yup from "yup";
import { ClubDTOschema } from "../validations/ClubDTO.schema";
export type ClubDTO=yup.InferType<typeof ClubDTOschema>
