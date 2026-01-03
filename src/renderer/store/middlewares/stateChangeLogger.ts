/**
 * stateChangeLogger
 *
 * Redux middleware for logging state changes.
 * Logs previous and next state when actions are dispatched.
 */

import type { Middleware } from "@reduxjs/toolkit";

export default (): Middleware => {
  return (storeApi) => (next) => (action) => {
    const prevState = storeApi.getState();
    const result = next(action);
    const nextState = storeApi.getState();

    console.log("StateChangeLogger Middleware triggered");

    if (prevState !== nextState) {
      const actionType =
        typeof action === "object" && action && "type" in action
          ? String((action as { type: unknown }).type)
          : "UNKNOWN_ACTION";

      console.groupCollapsed(`🔄 Redux: ${actionType}`);
      console.log("Prev state:", prevState);
      console.log("Next state:", nextState);
      console.log("Action:", action);
      console.groupEnd();
    }

    return result;
  };
};
