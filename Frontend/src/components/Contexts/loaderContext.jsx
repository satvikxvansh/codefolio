import { createContext, useContext, useState } from "react";
const loaderContext = createContext();

export function LoaderProvider({ children }) {
  const [sync, setSync] = useState(false);

  const isSync = (val) => {
    setSync(val);
  }

  return (
    <loaderContext.Provider value={{ sync, isSync }}>
      {children}
    </loaderContext.Provider>
  );
}

export const useLoader = () => useContext(loaderContext);