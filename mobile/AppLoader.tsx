// courtesy of https://javascript.plainenglish.io/how-to-handle-and-design-the-startup-of-a-react-application-da779f3727e5
import { every } from "lodash";
import React, { FC, Fragment, memo, ReactElement, ReactNode, useEffect, useState } from "react";
import { useGetEvents, useGetMessages, useGetOffers, useGetResources, useGetTeam } from "./hooks/query";
import { imagePrefetch } from "./imagePrefetch";
import { useAsync } from "./hooks/useAsync";

interface LoadingProcess {
  name: string;
  isReady: boolean;
}

interface Props {
  minimumLoadingTime: number;
  loadingComponent: ReactElement;
  children: ReactNode;
}

const AppLoader: FC<Props> = memo(props => {
  const [minimumDurationPassed, setMinimumDurationPassed] = useState<boolean>((props.minimumLoadingTime || 0) <= 0);

  // processes to load before loading app
  const { isLoading: eventsIsLoading, data: events } = useGetEvents();
  const { isLoading: teamIsLoading, data: team } = useGetTeam();
  const { isLoading: offersIsLoading, data: offers } = useGetOffers();
  const { isLoading: resourcesIsLoading, data: resources } = useGetResources();
  const { isLoading: messagesIsLoading, data: messages } = useGetMessages();

  // As long as not all screens are ready, display splashscreen
  const loadingProcesses: LoadingProcess[] = [
    {
      name: "fetch_events",
      isReady: !eventsIsLoading,
    },
    {
      name: "fetch_team",
      isReady: !teamIsLoading,
    },
    {
      name: "fetch_offers",
      isReady: !offersIsLoading,
    },
    {
      name: "fetch_resources",
      isReady: !resourcesIsLoading,
    },
    {
      name: "fetch_messages",
      isReady: !messagesIsLoading,
    },
  ];

  const everyProcessIsReady = every(loadingProcesses, "isReady");

  // Handle potential minimum duration
  const promisedTimeout = () => new Promise<boolean>(
    resolve =>
      setTimeout(() => resolve(true), props.minimumLoadingTime));
  useAsync<boolean>(promisedTimeout, setMinimumDurationPassed);

  useEffect(() => {
    if (everyProcessIsReady) {
      const imageUrls: string[] = [
        ...events?.flatMap(event => event.imageUrl ? [event.imageUrl] : []) || [],
        ...team?.flatMap(member => member.imageUrl ? [member.imageUrl] : []) || [],
        ...offers?.flatMap(offer => offer.imageUrl ? [offer.imageUrl] : []) || [],
        ...resources?.map(resource => resource.resourceTagId.imageUrl) || [],
        ...messages?.flatMap(message => message.image ? [message.image] : []) || [],
      ];
      void imagePrefetch(imageUrls);
    }
  }, [loadingProcesses]);

  return (
    <Fragment>
      {everyProcessIsReady && minimumDurationPassed ? props.children : props.loadingComponent}
    </Fragment>
  );
});

export default AppLoader;
