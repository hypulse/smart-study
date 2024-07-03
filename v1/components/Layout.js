import useToast from "../hooks/useToast.js";
import { html, useState } from "../libs/preact.js";
import LayoutManager from "../utils/LayoutManager.js";
import Drawer from "./Drawer.js";
import Home from "./Home.js";

export default function Layout() {
  const [widgets, setWidgets] = useState(
    LayoutManager.getWidgetsLayout(
      LayoutManager.defaultWidgets,
      LayoutManager.defaultLayout
    )
  );
  const layoutManager = new LayoutManager(widgets, setWidgets);
  const activeWidgets = widgets.filter((widget) => widget.active);
  const ToastC = useToast();

  return html`
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <${Home} activeWidgets=${activeWidgets} />
      <${Drawer} widgets=${widgets} layoutManager=${layoutManager} />
    </div>
    <${ToastC} />
  `;
}
