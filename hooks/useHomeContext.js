import { createContext, useContext } from "../libs/preact.js";

const HomeContext = createContext({});

const useHomeContext = () => {
  return useContext(HomeContext);
};

const HomeContextProvider = HomeContext.Provider;

export { useHomeContext, HomeContextProvider };
