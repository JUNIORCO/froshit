// courtesy of https://javascript.plainenglish.io/how-to-handle-and-design-the-startup-of-a-react-application-da779f3727e5
import { every } from "lodash";
import React, { FC, Fragment, memo, ReactElement, useEffect, useState } from "react";
import { useGetEvents, useGetMessages, useGetOffers, useGetResources, useGetTeam } from "./hooks/query";
import { imagePrefetch } from "./imagePrefetch";

interface LoadingProcess {
  name: string;
  isReady: boolean;
}

interface Props {
  /**
   * In ms. If provided this will make the loading last for the given duration even if everything has loaded.
   *
   * @type {number}
   * @memberof Props
   */
  minimumLoadingTime?: number;

  /**
   * Can be a splashscreen or whatever
   *
   * @type {ReactElement}
   * @memberof Props
   */
  loadingComponent: ReactElement;

  children: any;
}

/**
 * A component used to display a loading while some processes are loading.
 */
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

  // Handle potential minimum duration
  useEffect(() => {
    if (props.minimumLoadingTime) {
      setTimeout(() => setMinimumDurationPassed(true), props.minimumLoadingTime);
    }
  }, []);

  useEffect(() => {
    if (every(loadingProcesses, "isReady")) {
      const imageUrls: string[] = [
        ...events?.flatMap(event => event.imageUrl ? [event.imageUrl] : []) || [],
        ...team?.flatMap(member => member.imageUrl ? [member.imageUrl] : []) || [],
        ...offers?.flatMap(offer => offer.imageUrl ? [offer.imageUrl] : []) || [],
        // ...resources?.map(resource => resource.resou) || [],
        ...messages?.flatMap(message => message.image ? [message.image] : []) || [],
      ];
      void imagePrefetch(imageUrls);
    }
  }, [loadingProcesses]);

  return (
    <Fragment>
      {every(loadingProcesses, "isReady") && minimumDurationPassed ? props.children : props.loadingComponent}
    </Fragment>
  );
});

export default AppLoader;
