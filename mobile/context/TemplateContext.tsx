import { createContext, useEffect, useState } from "react";
import dayjs from "../utils/dayjs";
import { useGetEvents } from "../hooks/query";

export const TemplateContext = createContext({
});

export default function TemplateProvider({ children }) {
  const {
    isLoading: eventsIsLoading,
    isError: eventsIsError,
    data: events,
    error: eventsError,
  } = useGetEvents();

  return (
    <TemplateContext.Provider
      value={{
        events,
        eventsIsLoading,
        eventsIsError,
        eventsError,
      }}>
      {children}
    </TemplateContext.Provider>);
}
