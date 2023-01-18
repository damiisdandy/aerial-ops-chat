import { ActionIcon, Box, Text, Image } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoMdClose } from "react-icons/io";
import { trpc, MESSAGE_LIMIT } from "~/utils/trpc";

type Props = {
  id: string;
  message: string;
  createdAt: string;
  imageURL?: string;
};

dayjs.extend(relativeTime);

export default function Message({ id, message, createdAt, imageURL }: Props) {
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.msg.delete.useMutation({
    onMutate: async ({ messageId }) => {
      // cancel previous/ongoing queries
      await utils.msg.list.cancel();
      const previousMessages = utils.msg.list.getInfiniteData({
        limit: MESSAGE_LIMIT,
      });
      // Optimistic update
      utils.msg.list.setInfiniteData({ limit: MESSAGE_LIMIT }, (data) => {
        if (!data) {
          return {
            pageParams: [],
            pages: [],
          };
        }

        return {
          ...data,
          // remove any message with that given ID
          pages: data.pages.map((page) => ({
            ...page,
            messages: page.messages.filter(
              (message) => message.id !== messageId
            ),
          })),
        };
      });
      return { ...previousMessages };
    },
    onSettled: () => {
      utils.msg.list.invalidate();
    },
  });

  const deleteMessage = async () => {
    try {
      await mutateAsync({
        messageId: id,
      });
    } catch (err) {
      showNotification({
        message: "Problem deleting message",
        color: "red",
      });
    }
  };

  return (
    <Box
      component="div"
      w="fit-content"
      sx={{
        scrollMargin: "200px",
        ":hover": {
          ".delete-action": {
            display: "flex",
          },
        },
      }}
    >
      <Text
        pos="relative"
        bg="#333"
        sx={{
          borderRadius: "5px",
          width: "fit-content",
        }}
        py="5px"
        px="sm"
      >
        <ActionIcon
          className="delete-action"
          display="none"
          pos="absolute"
          top="-10px"
          right="-10px"
          radius="md"
          size="sm"
          bg="#dc3545"
          onClick={deleteMessage}
          sx={{
            ":hover": {
              backgroundColor: "#dc3545",
              scale: "110%",
            },
          }}
        >
          <IoMdClose />
        </ActionIcon>
        {message}
      </Text>
      {imageURL && <Image mt="sm" maw="50%" src={imageURL} alt="" />}
      <Text color="#888" size="xs" mt="2px">
        {dayjs(createdAt).fromNow()}
      </Text>
    </Box>
  );
}
