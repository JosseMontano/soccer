import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import { useEffect } from "react";

type ParamsType = {
  amountVictories1: number;
  amountVictories2: number;
  prediction: string;
  game: any;
  onSubmit: (v1: number, v2: number) => void;
  setPrediction:(val:string)=>void 
};
export const Prediction = ({
  amountVictories1,
  amountVictories2,
  prediction,
  onSubmit,
  game,
  setPrediction
}: ParamsType) => {

  useEffect(() => {
   const handleLoad = async()=>{
    setPrediction("")
    await onSubmit(amountVictories1, amountVictories2);
   }
   handleLoad()
  }, [game]);

  return (
    <div className="flex gap-3">
      <span className="cursor-pointer">
        <Icon type={ICON.ROBOT} />
      </span>
      <span>{prediction == "" ? "Cargando..." : prediction}</span>
    </div>
  );
};
