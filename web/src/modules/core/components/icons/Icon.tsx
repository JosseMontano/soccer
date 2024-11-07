import IconCheck from "./tabler/iconCheck";
import IconHome from "./tabler/iconHome";
import IconPlayer from "./tabler/iconPlayer";
import IconQuestion from "./tabler/iconQuestion";
import IconSettings from "./tabler/iconSettings";
import IconShield from "./tabler/iconShield";
import IconX from "./tabler/iconX";

export enum ICON {
  CHECK = "check",
  X = "x",
  QUESTION = "question",
  SETTINGS = "settings",
  PLAYER = "player",
  HOME = " home",
  SHIELD = "shield",
}

interface Props {
  type: ICON;
}

const Icon = ({ type }: Props) => {
  const icons: Record<ICON, JSX.Element> = {
    [ICON.CHECK]: <IconCheck />,
    [ICON.X]: <IconX />,
    [ICON.QUESTION]: <IconQuestion />,
    [ICON.SETTINGS]: <IconSettings />,
    [ICON.PLAYER]: <IconPlayer />,
    [ICON.HOME]: <IconHome />,
    [ICON.SHIELD]: <IconShield />,
  };
  return icons[type];
};

Icon.Types = ICON;

export default Icon;
