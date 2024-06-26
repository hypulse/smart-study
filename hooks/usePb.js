import { useEffect, useState } from "../libs/preact.js";
import { getPb } from "../utils/pb-utils.js";

export default function usePb() {
  const pb = getPb();
  const [authenticated, setAuthenticated] = useState(pb.authStore.isValid);

  useEffect(() => {
    const pbAuthChangeHandler = (e) => {
      setAuthenticated(!!e.detail.authenticated);
    };

    document.addEventListener("pb-auth-change", pbAuthChangeHandler);

    return () => {
      document.removeEventListener("pb-auth-change", pbAuthChangeHandler);
    };
  }, []);

  return {
    pb,
    authenticated,
  };
}
