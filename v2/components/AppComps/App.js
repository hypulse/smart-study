import { CONFIG_RECORD_ID, PB_URL } from "../../env.js";
import { AppContextProvider } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import usePbData from "../../hooks/usePbData.js";
import { html, useEffect, useState } from "../../libs/preact.js";
import { getChaptersBySubject } from "../../utils/object-mapper.js";
import { syncAuth } from "../../utils/pb-utils.js";
import Home from "../HomeComps/Home.js";
import Loading from "../Loading.js";
import EnterCred from "./EnterCred.js";
import EnterDataInfo from "./EnterDataInfo.js";
import Popup from "./Popup.js";

export default function App() {
  const { authenticated } = usePb();
  const [dataReady, setDataReady] = useState(false);
  const { data: rawConfig, ready: rawConfigReady } = usePbData(
    "configs",
    CONFIG_RECORD_ID
  );
  const {
    data: rawSubjects,
    ready: rawSubjectsReady,
    fetchData: updateRawSubjects,
  } = usePbData("subjects");
  const {
    data: rawChapters,
    ready: rawChaptersReady,
    fetchData: updateRawChapters,
  } = usePbData("chapters");

  useEffect(() => {
    syncAuth();
  }, []);

  useEffect(() => {
    if (rawConfigReady && rawSubjectsReady && rawChaptersReady) {
      setDataReady(true);
    }
  }, [rawConfigReady, rawSubjectsReady, rawChaptersReady]);

  if (!PB_URL || !CONFIG_RECORD_ID) {
    return html`<${EnterDataInfo} />`;
  }

  if (!authenticated) {
    return html`<${EnterCred} />`;
  }

  if (!dataReady) {
    return html`<${Loading} />`;
  }

  const chaptersBySubject = getChaptersBySubject(rawSubjects, rawChapters);

  return html`
    <${AppContextProvider}
      value=${{
        rawConfig,
        rawSubjects,
        updateRawSubjects,
        rawChapters,
        updateRawChapters,
        chaptersBySubject,
      }}
      children=${html`
        <${Home} />
        <${Popup} />
      `}
    />
  `;
}
