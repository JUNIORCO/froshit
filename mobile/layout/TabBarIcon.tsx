import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  name: any;
}

export default function TabBarIcon({ name, ...props }: Props) {
  return (<MaterialCommunityIcons name={name} color='white' {...props}/>);
}
