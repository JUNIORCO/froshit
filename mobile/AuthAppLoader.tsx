// courtesy of https://javascript.plainenglish.io/how-to-handle-and-design-the-startup-of-a-react-application-da779f3727e5
import React, { FC, Fragment, memo, ReactElement, useEffect, useState } from "react";
import { imagePrefetch } from "./imagePrefetch";

interface Props {
  /**
   * In ms. If provided this will make the loading last for the given duration even if everything has loaded.
   *
   * @type {number}
   * @memberof Props
   */
  minimumLoadingTime: number;

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
const AuthAppLoader: FC<Props> = memo(props => {
  const [minimumDurationPassed, setMinimumDurationPassed] = useState<boolean>((props.minimumLoadingTime) <= 0);

  // processes to load before loading app
  void imagePrefetch();

  // Handle potential minimum duration
  useEffect(() => {
    setTimeout(() => setMinimumDurationPassed(true), props.minimumLoadingTime);
  }, []);

  return (
    <Fragment>
      {minimumDurationPassed ? props.children : props.loadingComponent}
    </Fragment>
  );
});

export default AuthAppLoader;
