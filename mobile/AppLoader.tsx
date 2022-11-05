// courtesy of https://javascript.plainenglish.io/how-to-handle-and-design-the-startup-of-a-react-application-da779f3727e5
import { every } from "lodash";
import React, { FC, Fragment, memo, ReactElement, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./hooks/query/QueryKeys";
import { fetchEvents } from "./api/events";

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
}

/**
 * A component used to display a loading while some processes are loading.
 */
const AppLoader: FC<Props> = memo(props => {
  const [minimumDurationPassed, setMinimumDurationPassed] = useState<boolean>((props.minimumLoadingTime || 0) <= 0);

  // processes to load before loading app
  const { isLoading: eventsIsLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS],
    queryFn: fetchEvents,
  })

  // As long as not all screens are ready, display splashscreen
  const loadingProcesses = [
    {
      name: "fetch_user_events",
      isReady: !eventsIsLoading,
    },
  ];

  // Handle potential minimum duration
  useEffect(() => {
    if (props.minimumLoadingTime) {
      setTimeout(() => setMinimumDurationPassed(true), props.minimumLoadingTime);
    }
  }, []);

  return (
    <Fragment>
      {every(loadingProcesses, "isReady") && minimumDurationPassed ? props.children : props.loadingComponent}
    </Fragment>
  );
});

export default AppLoader;
