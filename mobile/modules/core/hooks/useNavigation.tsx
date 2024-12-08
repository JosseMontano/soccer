import { useLinkTo } from "@react-navigation/native";

type Redirect = "Welcome" | "Home"

export const useNagigation = () => {
  const linkTo = useLinkTo();

  const handleRedirect = (v:Redirect) => {
    linkTo("/"+v);
  };

  return {
    handleRedirect
  };
};
