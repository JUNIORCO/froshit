import dayjs from "../utils/dayjs";
import { Message } from "../supabase/types/extended";
import { IMessage } from "react-native-gifted-chat/lib/Models";

export const formatMessage = (message: Message['Row']): IMessage => ({
  _id: message.id,
  text: message.content,
  createdAt: dayjs.prototype.formatToUserTimezone(message.createdAt),
  user: {
    _id: message.profileId,
    name: `${message.profileFirstName} ${message.profileLastName}`,
    avatar: message.profileImageUrl || undefined
  },
});
