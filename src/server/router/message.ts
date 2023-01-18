import { addMessageSchema, deleteMessageSchema, fetchMessagesSchema } from "../schema/message";
import { publicProcedure, router } from "../trpc";
import { ObjectID } from 'bson';
import { deleteImage, getSignedURL } from "~/utils/aws";

export const messageRouter = router({
  add: publicProcedure.input(addMessageSchema).mutation(async ({ input, ctx }) => {
    const { message, hasImage } = input;
    const { prisma } = ctx;

    // prisma create connect object for creating image with message.create()
    let imageCreation = {};
    // S3 signed URL
    let s3SignedURL = '';

    if (hasImage) {
      const imageId = new ObjectID().toHexString();
      s3SignedURL = await getSignedURL(imageId);
      imageCreation = {
        image: {
          create: {
            id: imageId
          }
        }
      }
    }

    const newMessage = await prisma.message.create({
      data: {
        message,
        ...imageCreation,
      },
    })

    return { ...newMessage, s3SignedURL }
  }),

  list: publicProcedure.input(fetchMessagesSchema).query(async ({ input, ctx }) => {
    const { cursor } = input;
    const { prisma } = ctx;
    // pagination limit (content per page)
    const limit = input.limit ?? 10

    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1,
      cursor: cursor ? {
        id: cursor,
      } : undefined,
      include: {
        image: true,
      }
    })

    let nextCursor: typeof cursor | undefined = undefined;
    // if there are more messages that exceed limit (content per page), move cursor ro next item
    if (messages.length > limit) {
      const nextItem = messages.pop()
      nextCursor = nextItem!.id;
    }


    return {
      messages: messages.map(({ image, ...rest }) => ({
        ...rest,
        imageURL: image?.id,
        // reverse paginated messages so it render from top to bottom in UI
      })).reverse(),
      nextCursor,
    }
  }),

  delete: publicProcedure.input(deleteMessageSchema).mutation(async ({ input, ctx }) => {
    const { prisma } = ctx;
    const { messageId } = input;

    const messageExist = await prisma.message.findUnique({
      where: {
        id: messageId,
      }
    })
    // check if message exists before attemting to delete it (fail silently)
    if (messageExist) {
      const deletedMessage = await prisma.message.delete({
        where: {
          id: messageId,
        },
        include: {
          image: true,
        }
      });
      if (deletedMessage.image) {
        // also delete image on S3
        deleteImage(deletedMessage.image.id);
      }
    }
    return null;
  })
});