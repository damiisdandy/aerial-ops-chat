import { Box } from "@mantine/core";
import { useRef } from "react";
import Chatbox from "~/components/Chatbox";
import Chatinput from "~/components/Chatinput";

export default function IndexPage() {
  const messageListRef = useRef<HTMLDivElement>(null);

  const scrollToLastMessage = () => {
    const lastMessage = messageListRef.current?.lastElementChild;
    lastMessage?.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth",
    });
  };

  return (
    <Box
      component="div"
      w="100vw"
      h="100vh"
      mah="700px"
      maw="450px"
      pos="relative"
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Chatbox ref={messageListRef} />
      <Chatinput scrollToLastMessage={scrollToLastMessage} />
    </Box>
  );
}
