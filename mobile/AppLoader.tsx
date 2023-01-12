// courtesy of https://javascript.plainenglish.io/how-to-handle-and-design-the-startup-of-a-react-application-da779f3727e5
import { some } from "lodash";
import React, { FC, Fragment, memo, ReactElement, useEffect, useState } from "react";
import { useGetEvents, useGetMessages, useGetOffers, useGetResources, useGetTeam } from "./hooks/query";

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
  const { isLoading: eventsIsLoading } = useGetEvents();
  const { isLoading: teamIsLoading } = useGetTeam();
  const { isLoading: offersIsLoading } = useGetOffers();
  const { isLoading: resourcesIsLoading } = useGetResources();
  const { isLoading: messagesIsLoading } = useGetMessages();

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
    }
  ];

  // Handle potential minimum duration
  useEffect(() => {
    if (props.minimumLoadingTime) {
      setTimeout(() => setMinimumDurationPassed(true), props.minimumLoadingTime);
    }
  }, []);

  return (
    <Fragment>
      {some(loadingProcesses, "isReady") && minimumDurationPassed ? props.children : props.loadingComponent}
    </Fragment>
  );
});

export default AppLoader;
