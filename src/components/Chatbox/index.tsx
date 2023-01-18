import { Flex } from "@mantine/core";

export default function Chatbox() {
  return (
    <Flex
      direction="column"
      sx={{ overflow: "hidden" }}
      h="93%"
      bg="#111"
      p="sm"
    >
      <Flex direction="column" pb="40px" gap="sm">
        {/* messages goes here */}
      </Flex>
    </Flex>
  );
}
