import * as yup from "yup";
import { TournamentDTOschema } from "../validations/TournamentDTO.schema";
export type TournamentDTO = yup.InferType<typeof TournamentDTOschema>;
