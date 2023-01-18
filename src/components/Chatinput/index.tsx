import {
  ActionIcon,
  Button,
  FileButton,
  Flex,
  Input,
  Text,
  Transition,
} from "@mantine/core";
import { ObjectID } from "bson";
import { ChangeEventHandler, FormEventHandler, useRef, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { MESSAGE_LIMIT, trpc } from "~/utils/trpc";
import dayjs from "dayjs";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

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

  const utils = trpc.useContext();
  const { mutateAsync } = trpc.msg.add.useMutation({
    onMutate: async (newMessage) => {
      // clear input field
      setText("");
      // cancel previous queries
      await utils.msg.list.cancel();
      // get stores messages
      const previousMessages = utils.msg.list.getInfiniteData({
        limit: MESSAGE_LIMIT,
      });
      utils.msg.list.setInfiniteData({ limit: MESSAGE_LIMIT }, (data) => {
        if (!data) {
          return {
            pageParams: [],
            pages: [],
          };
        }

        // Optimistic updates
        const messageId = new ObjectID().toHexString();
        // get current paginated page to add new data into
        const otherPages = [...data.pages.slice(0, data.pages.length - 1)];
        const currentPage = data.pages.pop();
        return {
          ...data,
          pages: [
            ...otherPages,
            {
              ...currentPage,
              messages: [
                ...(currentPage?.messages || []),
                {
                  ...newMessage,
                  id: messageId,
                  // render blob image for optimistic update
                  imageURL: file ? URL.createObjectURL(file) : undefined,
                  createdAt: dayjs().toString(),
                  updatedAt: "",
                },
              ],
            },
          ],
        };
      });
      return { ...previousMessages };
    },
    onSettled: () => {
      setFile(null);
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const newMessage = await mutateAsync({
        message: text,
        hasImage: file !== null,
      });
      if (newMessage.s3SignedURL) {
        await axios.put(newMessage.s3SignedURL, file);
        // if it has an image invalidate query after image has been upload
        // to prevent fetching image URL that does not exist
        utils.msg.list.invalidate();
      } else {
        // if no image, invalide after message is created
        utils.msg.list.invalidate();
      }
    } catch (err) {
      showNotification({
        message: "Problem sending message",
        color: "red",
      });
    }
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
