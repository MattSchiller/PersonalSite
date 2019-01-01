import IMap from "@Interfaces/IMap";
import ISimTypeContent from "@Interfaces/ISimTypeContent";

export default interface IStore {
    activePageId: string;
    pages: IMap<ISimTypeContent>;
}
