import { IThemeEnum } from "@Helpers/IThemeEnum";
import { IThemedProps } from "@Helpers/Theming";
import { ActionTypes } from "@Redux/Actions";
import { initialState } from "@Redux/InitialState";
import { IThemeAction } from "@Redux/Interfaces/IAction";

export function themeReducer(theme: IThemedProps = initialState.theme, action: IThemeAction) {
    if (action.payload && action.type === ActionTypes.SET_ACTIVE_THEME) {
        const activeTheme = action.payload;

        if (Object.values(IThemeEnum).includes(activeTheme) && activeTheme !== theme.activeTheme)
            return {
                activeTheme
            };
    } else
        return theme;
}
