import { MessageType } from "../components/chat";
import dayjs from "dayjs";
import { Message } from "../supabase/extended.types";

export const formatMessage = (message: Message['Row']): MessageType.Text => ({
  author: {
    id: message.profileId,
    firstName: message.profileFirstName,
    lastName: message.profileLastName,
    imageUrl: message.profileImageUrl || undefined,
  },
  createdAt: +dayjs(message.createdAt).valueOf(),
  id: message.id,
  text: message.content,
  type: 'text',
});
