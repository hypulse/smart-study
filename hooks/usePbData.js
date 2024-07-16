import { DB_PREFIX } from "../env.js";
import { useEffect, useState } from "../libs/preact.js";
import usePb from "./usePb.js";

export default function usePbData(collectionId, recordId, options = {}) {
  collectionId = `${DB_PREFIX}_${collectionId}`;
  const { pb, authenticated } = usePb();
  const isGetOne = !!recordId;
  const defaultData = !!recordId ? {} : [];
  const [data, setData] = useState(defaultData);
  const [ready, setReady] = useState(false);
  options.requestKey = null;

  const fetchData = async () => {
    try {
      if (isGetOne) {
        const record = await pb
          .collection(collectionId)
          .getOne(recordId, options);
        setData(record);
      } else {
        const records = await pb.collection(collectionId).getFullList(options);
        setData(records);
      }
      setReady(true);
    } catch (_) {
      resetData();
    }
  };

  const resetData = () => {
    setData(defaultData);
    setReady(false);
  };

  useEffect(() => {
    if (!authenticated) {
      resetData();
      return;
    }

    fetchData();
  }, [authenticated]);

  return {
    data,
    ready,
    fetchData,
    resetData,
  };
}
