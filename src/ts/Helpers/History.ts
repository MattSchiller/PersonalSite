import { createBrowserHistory, History, Location } from "history";

export const history: History = createBrowserHistory();

export function getTrimmedPath(location: Location): string {
    return location.pathname.replace("/", "");
}
