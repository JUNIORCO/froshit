import React, { Fragment } from 'react';
import { useGetTeam } from "../hooks/query";
import TeamCard from "../components/team/TeamCard";
import useSession from "../hooks/useSession";
import { Text, Card } from "react-native-paper";
import { Profile, Role } from "../supabase/types/extended";
import { commonStyles } from "./styles/Common.styles";
import { styles } from './styles/TeamScreen.styles';

export default function TeamScreen() {
  const { profile } = useSession();
  const {
    isLoading: teamIsLoading,
    isError: teamIsError,
    data: team,
    error: teamError,
  } = useGetTeam();

  const formattedTeam = team?.reduce((accum, member) => {
    if (member.role === 'Leader') {
      accum[0].data.push(member);
    } else if (member.role === 'Froshee') {
      accum[1].data.push(member);
    }
    return accum;
  }, [
    {
      title: 'Leaders',
      data: [] as any,
    },
    {
      title: 'Froshees',
      data: [] as any,
    }
  ]) || [];

  const renderGroup = (group: { title: string, data: Profile['Row'][] }) =>
    <Fragment key={group.title}>
      <Text style={styles.groupTitle}>{group.title}</Text>
      {group.data.map(member => <TeamCard key={member.id} {...member} isLeader={member.role === 'Leader' as Role}/>)}
    </Fragment>

  return (
    <Card style={commonStyles.mainCard}>
      <Text style={styles.teamName}>{profile.team?.name || 'Your Team'}</Text>
      {formattedTeam.map(renderGroup)}
    </Card>
  )
}
