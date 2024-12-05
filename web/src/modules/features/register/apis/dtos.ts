import * as yup from "yup";
import { RegisterDTOschema } from "../validations/RegisterDTO.schema";

export type RegisterDTO = yup.InferType<typeof RegisterDTOschema>;
