import {
  ActionIcon,
  Button,
  FileButton,
  Flex,
  Input,
  Text,
  Transition,
} from "@mantine/core";
import { ChangeEventHandler, FormEventHandler, useRef, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { IoMdClose } from "react-icons/io";

export default function Chatinput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onTextChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value);
  };

  const onFileChange = (file: File | null) => {
    setFile(file);
    if (fileInputRef.current) {
      fileInputRef.current!.value = "";
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current!.value = "";
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  };

  return (
    <form
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
      }}
      onSubmit={onSubmit}
    >
      <Transition
        mounted={file !== null}
        transition="slide-up"
        duration={300}
        timingFunction="ease"
      >
        {(styles) => (
          <Flex
            style={styles}
            bg="#222"
            h="40px"
            px="xs"
            w="100%"
            align="center"
            justify="space-between"
          >
            <Text maw="90%" truncate>
              Attach image{" "}
              <Text display="inline" color="blue">
                {file?.name}
              </Text>
              <Text display="inline" color="#888" size="xs">
                {" "}
                ({Math.round((file?.size || 0) / 1024)} kb)
              </Text>
            </Text>
            <ActionIcon color="white" onClick={clearFile}>
              <IoMdClose />
            </ActionIcon>
          </Flex>
        )}
      </Transition>
      <Flex
        px="sm"
        align="center"
        justify="space-between"
        h="7%"
        w="100%"
        bg="#171717"
        gap="sm"
        py="sm"
      >
        <Input
          maxLength={200}
          minLength={3}
          value={text}
          w="100%"
          onChange={onTextChange}
        />
        <FileButton accept="image/*" onChange={onFileChange}>
          {(props) => (
            <ActionIcon {...props} size="lg" color="white">
              <ImAttachment />
            </ActionIcon>
          )}
        </FileButton>
        <Button type="submit">Send</Button>
      </Flex>
    </form>
  );
}
