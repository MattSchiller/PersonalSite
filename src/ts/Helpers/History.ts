import { createBrowserHistory, History, Location, Path } from "history";

export const history: History = createBrowserHistory();

export function getTrimmedPath(location: Location): string {
    return location.pathname.replace("/", "");
}

export function historyPush(path: Path) {
    if (getTrimmedPath(history.location) !== path)
        history.push(path);
}
