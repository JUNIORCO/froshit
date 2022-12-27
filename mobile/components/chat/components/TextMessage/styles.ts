import { StyleSheet } from 'react-native'

import { MessageType, Theme, User } from '../../types'
import { getUserAvatarNameColor } from '../../utils'

const styles = ({
  message,
  theme,
  user,
}: {
  message: MessageType.Text
  theme: Theme
  user?: User
}) =>
  StyleSheet.create({
    descriptionText: {
      ...(user?.id === message.author.id
        ? theme.fonts.sentMessageLinkDescriptionTextStyle
        : theme.fonts.receivedMessageLinkDescriptionTextStyle),
      marginTop: 4,
    },
    headerText: {
      ...theme.fonts.userNameTextStyle,
      color: getUserAvatarNameColor(
        message.author,
        theme.colors.userAvatarNameColors
      ),
      marginBottom: 6,
    },
    titleText:
      user?.id === message.author.id
        ? theme.fonts.sentMessageLinkTitleTextStyle
        : theme.fonts.receivedMessageLinkTitleTextStyle,
    text:
      user?.id === message.author.id
        ? theme.fonts.sentMessageBodyTextStyle
        : theme.fonts.receivedMessageBodyTextStyle,
    textContainer: {
      marginHorizontal: theme.insets.messageInsetsHorizontal,
      marginVertical: theme.insets.messageInsetsVertical,
    },
    createdAt: {
      fontSize: 12,
      fontWeight: '400',
      color: user?.id === message.author.id ? '#C5C5C5' : '#696969',
      alignSelf: user?.id === message.author.id ? 'flex-end' : 'flex-start',
      marginTop: 4,
    }
  })

export default styles
