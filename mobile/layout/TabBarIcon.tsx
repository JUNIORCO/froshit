import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  name: string;
}

export default function TabBarIcon({ name, ...props }: Props) {
  return (
    <MaterialCommunityIcons name={name} {...props}/>
  );
}
