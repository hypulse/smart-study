import { createContext, useContext } from "../libs/preact.js";

const AppContext = createContext({});

/**
 * @returns {AppContext}
 */
const useAppContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = AppContext.Provider;

export { useAppContext, AppContextProvider };
