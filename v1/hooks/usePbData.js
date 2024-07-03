import { useEffect, useState } from "../libs/preact.js";
import usePb from "./usePb.js";

export default function usePbData(collectionId, recordId) {
  const { pb, authenticated } = usePb();
  const isGetOne = !!recordId;
  const defaultData = !!recordId ? {} : [];
  const [data, setData] = useState(defaultData);

  const fetchData = async () => {
    try {
      if (isGetOne) {
        const record = await pb
          .collection(collectionId)
          .getOne(recordId, { requestKey: null });
        setData(record);
      } else {
        const records = await pb
          .collection(collectionId)
          .getFullList({ requestKey: null });
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
