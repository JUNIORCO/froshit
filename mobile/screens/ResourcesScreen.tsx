import { useState } from "react";
import { Card } from "react-native-paper";
import { commonStyles } from "./styles/Common.styles";
import ResourceTagList, { GroupedResource } from "../components/resources/ResourceTagList";
import ResourceCard from "../components/resources/ResourceCard";

export default function EventsScreen() {
  const [selectedTag, setSelectedTag] = useState<GroupedResource | null>(null);

  return (
    <Card style={commonStyles.mainCard}>
      {selectedTag ? <ResourceCard selectedTag={selectedTag} setSelectedTag={setSelectedTag}/> : <ResourceTagList setSelectedTag={setSelectedTag} />}
    </Card>
  )
}
