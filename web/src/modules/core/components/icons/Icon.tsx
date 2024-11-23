import IconCalendar from "./tabler/iconCalendar";
import IconCheck from "./tabler/iconCheck";
import IconChevronDown from "./tabler/iconChevronDown";
import IconHome from "./tabler/iconHome";
import IconPlayer from "./tabler/iconPlayer";
import IconQuestion from "./tabler/iconQuestion";
import IconSettings from "./tabler/iconSettings";
import IconShield from "./tabler/iconShield";
import IconTrophy from "./tabler/iconTrophy";
import IconX from "./tabler/iconX";

export enum ICON {
  CHECK = "check",
  X = "x",
  QUESTION = "question",
  SETTINGS = "settings",
  PLAYER = "player",
  HOME = " home",
  SHIELD = "shield",
  CALENDAR = "calendar",
  TROPHY = "trophy",
  CHEVRON_DOWN = "chevron_down",
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
    [ICON.CALENDAR]: <IconCalendar />,
    [ICON.TROPHY]: <IconTrophy />,
    [ICON.CHEVRON_DOWN]: <IconChevronDown />,
  };
  return icons[type];
};

Icon.Types = ICON;

export default Icon;
