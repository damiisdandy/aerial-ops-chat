import { Flex } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Flex
      h="100vh"
      w="100vw"
      justify="center"
      align="center"
      direction="column"
    >
      {children}
    </Flex>
  );
}
