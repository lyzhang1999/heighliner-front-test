/**
 * Define constants used globally.
 * You should add prefix `Global_[enum-name]_` to each value in case
 * have same default value with other enum value where imported.
 */

export enum Result {
  Loading = "Global_Result_Loading",
  Error = "Global_Result_Error",
  Success = "Global_Result_Success",
}

// Extends an enum type by this way:
export enum Status {
  Initial = "Global_Status_Initial",
  Executing = "Global_Status_Executing",
  Error = "Global_Status_Error",
  Success = "Global_Status_Success",
}

export enum ChangeStatusAction {
  ToInitial = "Global_ChangeStatusAction_ToInitial",
  ToExecuting = "Global_ChangeStatusAction_ToExecuting",
  ToError = "Global_ChangeStatusAction_ToError",
  ToSuccess = "Global_ChangeStatusAction_ToSuccess",
}

export enum Direction {
  Left = "Global_Direction_Left",
  Right = "Global_Direction_Right",
  Up = "Global_Direction_Up",
  Down = "Global_Direction_Down",
}
