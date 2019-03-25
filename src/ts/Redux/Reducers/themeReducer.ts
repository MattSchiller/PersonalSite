import { IThemeEnum } from "@Helpers/IThemeEnum";
import { initialState } from "@Redux/InitialState";
import { IThemeAction } from "@Redux/Interfaces/IAction";
import { ActionTypes } from "@Redux/ActionTypes";
import { IStoreTheme } from "@Redux/Interfaces/IStore";

export function themeReducer(theme: IStoreTheme = initialState.theme, action: IThemeAction) {
    const activeTheme = action.payload;

    if (activeTheme && action.type === ActionTypes.SET_ACTIVE_THEME) {
        if (Object.values(IThemeEnum).includes(activeTheme) && activeTheme !== theme.activeTheme)
            return {
                activeTheme
            };
    }

    return theme;
}
