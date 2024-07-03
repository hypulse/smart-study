import { html, useEffect } from "../../libs/preact.js";

export default function WeatherWidget() {
  const addScript = () => {
    const id = "tomorrow-sdk";
    if (document.getElementById(id)) {
      if (window.__TOMORROW__) {
        window.__TOMORROW__.renderWidget();
      }
      return;
    }
    const fjs = document.getElementsByTagName("script")[0];
    const js = document.createElement("script");
    js.id = id;
    js.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";

    fjs.parentNode.insertBefore(js, fjs);
  };

  useEffect(() => {
    addScript();
  }, []);

  return html`
    <div
      class="tomorrow"
      data-location-id="065324"
      data-language="KO"
      data-unit-system="METRIC"
      data-skin="dark"
      data-widget-type="upcoming"
    />
  `;
}
