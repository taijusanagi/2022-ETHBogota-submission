import { useBreakpointValue } from "@chakra-ui/react";

export const useIsDesktop = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  return { isDesktop };
};
