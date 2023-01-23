// courtesy of https://javascript.plainenglish.io/how-to-handle-and-design-the-startup-of-a-react-application-da779f3727e5
import React, { FC, Fragment, memo, ReactElement, ReactNode, useState } from "react";
import { imagePrefetch } from "./imagePrefetch";
import { useAsync } from "./hooks/useAsync";

interface Props {
  minimumLoadingTime: number;
  loadingComponent: ReactElement;
  children: ReactNode;
}

const AuthAppLoader: FC<Props> = memo(props => {
  const [minimumDurationPassed, setMinimumDurationPassed] = useState<boolean>((props.minimumLoadingTime) <= 0);

  // processes to load before loading app
  void imagePrefetch();

  // Handle potential minimum duration
  const promisedTimeout = () => new Promise<boolean>(
    resolve =>
      setTimeout(() => resolve(true), props.minimumLoadingTime));
  useAsync<boolean>(promisedTimeout, setMinimumDurationPassed);

  return (
    <Fragment>
      {minimumDurationPassed ? props.children : props.loadingComponent}
    </Fragment>
  );
});

export default AuthAppLoader;
