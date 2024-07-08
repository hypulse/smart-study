import { useEffect, useState } from "../libs/preact.js";
import usePb from "./usePb.js";

export default function usePbData(collectionId, recordId, options = {}) {
  const { pb, authenticated } = usePb();
  const isGetOne = !!recordId;
  const defaultData = !!recordId ? {} : [];
  const [data, setData] = useState(defaultData);
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
    } catch (_) {
      resetData();
    }
  };

  const resetData = () => {
    setData(defaultData);
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
    setData,
    fetchData,
  };
}
