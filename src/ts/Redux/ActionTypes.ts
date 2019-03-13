enum CoreActionTypeEnum {
    SET_ACTIVE_PAGE = "SET_ACTIVE_PAGE",
    SET_ACTIVE_THEME = "SET_ACTIVE_THEME",
    UPDATE_SIMTYPE_CONTENT = "UPDATED_SIMTYPE_CONTENT",
}

enum HistoryActionTypeEnum {
    PUSH = "PUSH",
}

export const ActionTypeEnum = {
    ...CoreActionTypeEnum,
    // ...HistoryActionTypeEnum,
};

export type ActionType = CoreActionTypeEnum;
