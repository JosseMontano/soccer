import IconCheck from "./tabler/iconCheck";
import IconQuestion from "./tabler/iconQuestion";
import IconX from "./tabler/iconX";

export enum ICON {
  CHECK = "check",
  X = "x",
  QUESTION = "question",
}

interface Props {
  type: ICON;
}

const Icon = ({ type }: Props) => {
  const icons: Record<ICON, JSX.Element> = {
    [ICON.CHECK]: <IconCheck />,
    [ICON.X]: <IconX />,
    [ICON.QUESTION]: <IconQuestion />,
  };
  return icons[type];
};

Icon.Types = ICON;

export default Icon;