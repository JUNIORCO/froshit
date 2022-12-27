import { MessageType } from "../components/chat";
import dayjs from "dayjs";
import { Message } from "../@types/message";

export const formatMessage = (message: Message): MessageType.Text => ({
  author: {
    id: message.profileId,
    firstName: message.profileFirstName,
    lastName: message.profileLastName,
  },
  createdAt: +dayjs(message.createdAt).valueOf(),
  id: message.id,
  text: message.content,
  type: 'text',
});
