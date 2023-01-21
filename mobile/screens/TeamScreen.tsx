import React, { Fragment } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useGetTeam } from "../hooks/query";
import TeamCard from "../components/team/TeamCard";
import useSession from "../hooks/useSession";
import { Card } from "react-native-paper";
import { Profile, Role } from "../supabase/extended.types";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
  },
  title: {
    fontSize: 32,
    marginVertical: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    marginVertical: 8,
  },
});

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
      <Text style={styles.header}>{group.title}</Text>
      {group.data.map(member => <TeamCard key={member.id} {...member} isLeader={member.role === 'Leader' as Role}/>)}
    </Fragment>

  return (
    <Card style={{ padding: 16, borderRadius: 16 }}>
      <Text style={styles.title}>{profile.team.name}</Text>
      {formattedTeam.map(renderGroup)}
    </Card>
  )
}
