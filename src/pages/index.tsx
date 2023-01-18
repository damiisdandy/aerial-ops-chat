import { Box } from "@mantine/core";
import Chatbox from "~/components/Chatbox";
import Chatinput from "~/components/Chatinput";
import { trpc } from "~/utils/trpc";

export default function IndexPage() {
  return (
    <Box
      component="div"
      w="100vw"
      h="100vh"
      mah="800px"
      maw="450px"
      pos="relative"
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Chatbox />
      <Chatinput />
    </Box>
  );
}
