import { IThemeEnum } from "@Helpers/IThemeEnum";
import { IThemedProps } from "@Helpers/Theming";
import { initialState } from "@Redux/InitialState";
import { IThemeAction } from "@Redux/Interfaces/IAction";
import { ActionTypeEnum } from "@Redux/ActionTypes";

export function themeReducer(theme: IThemedProps = initialState.theme, action: IThemeAction) {
    const activeTheme = action.payload;

    if (activeTheme && action.type === ActionTypeEnum.SET_ACTIVE_THEME) {
        if (Object.values(IThemeEnum).includes(activeTheme) && activeTheme !== theme.activeTheme)
            return {
                activeTheme
            };
    }

    return theme;
}
