import IMap from "@Interfaces/IMap";
import IPage from "@Interfaces/IPage";

export default interface IStore {
    activePageId: string;
    pages: IMap<IPage>;
}
