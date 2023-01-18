import { Flex, Text } from "@mantine/core";
import { MESSAGE_LIMIT, trpc } from "~/utils/trpc";
import { Message as MessageType } from "@prisma/client";
import {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import dayjs from "dayjs";
import Message from "../Message";
import { AiFillMessage } from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { useItersectionObserver } from "~/hooks/useIntersectionObserver";

const Chatbox = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    isLoading,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.msg.list.useInfiniteQuery(
    {
      limit: MESSAGE_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    }
  );

  const allMessages = useMemo<(MessageType & { imageURL: string })[]>(
    () =>
      data?.pages
        .reduce(
          // newlyAddedMessages are placed infront so its rendered ontop
          (initialMessages: any, newlyAddedMessages) => [
            ...newlyAddedMessages.messages,
            ...initialMessages,
          ],
          []
        )
        // sort merged messages according to timestamp on demand
        .sort((a: MessageType, b: MessageType) =>
          dayjs(a.createdAt).diff(b.createdAt, "millisecond")
        ),
    [data]
  );

  const loadMoreRef = useItersectionObserver(
    {
      callback: fetchNextPage,
      shouldObserve: hasNextPage && !isFetchingNextPage,
    },
    {
      threshold: 1,
    }
  );

  // on first load scroll to bottom of view
  useEffect(() => {
    if (data) {
      const chatBoxContainerRef =
        ref as MutableRefObject<HTMLDivElement | null>;
      if (data.pages.length === 1) {
        const lastChild = chatBoxContainerRef.current?.lastElementChild;
        lastChild?.scrollIntoView();
      }
    }
  }, [data]);

  return (
    <Flex
      direction="column"
      sx={{
        overflowY: "scroll",
        ...(isLoading || error || !allMessages.length
          ? {
              alignItems: "center",
              justifyContent: "center",
            }
          : {}),
      }}
      h="93%"
      bg="#111"
      p="sm"
    >
      {isLoading ? (
        <ImSpinner8
          className="spin"
          style={{
            fontSize: "40px",
          }}
        />
      ) : error ? (
        <>
          <IoMdClose
            style={{
              fontSize: "40px",
              color: "#dc3545",
            }}
          />
          <Text>Problem loading messages :(</Text>
        </>
      ) : !allMessages.length ? (
        <>
          <AiFillMessage
            style={{
              fontSize: "40px",
              color: "white",
            }}
          />
          <Text>There are no messages</Text>
        </>
      ) : (
        <Flex ref={ref} direction="column" pb="40px" gap="sm">
          <Text ref={loadMoreRef}>
            {isFetchingNextPage ? "Loading more messages..." : ""}
          </Text>
          {!hasNextPage && !isFetchingNextPage && (
            <Text align="center">You&apos;ve reached the top 🎉</Text>
          )}
          {allMessages.map(({ createdAt, ...message }) => (
            <Message
              key={message.id}
              {...message}
              createdAt={createdAt.toString()}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
});

export default Chatbox;
