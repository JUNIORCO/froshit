// courtesy of https://javascript.plainenglish.io/how-to-handle-and-design-the-startup-of-a-react-application-da779f3727e5
import { every } from "lodash";
import React, { FC, Fragment, memo, ReactElement, useEffect, useState } from "react";

interface LoadingProcess {
  name: string;
  isReady: boolean;
}

interface Props {
  /**
   * A collection of process that should be ready before displaying the application
   *
   * @type {LoadingProcess[]}
   * @memberof Props
   */
  mandatoryProcesses?: LoadingProcess[];

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

  // Handle potential minimum duration
  useEffect(() => {
    if (props.minimumLoadingTime) {
      setTimeout(() => setMinimumDurationPassed(true), props.minimumLoadingTime);
    }
  }, []);

  return (
    <Fragment>
      {every(props.mandatoryProcesses, "isReady") && minimumDurationPassed ? props.children : props.loadingComponent}
    </Fragment>
  );
});

export default AppLoader;
