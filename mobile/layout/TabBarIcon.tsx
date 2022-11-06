import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  icon: string;
  props: any;
}

export default function TabBarIcon({ name, ...props }: Props) {
  return (
    <MaterialCommunityIcons name={name} {...props}/>
  );
}
