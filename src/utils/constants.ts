export enum Result {
  Loading,
  Error,
  Success,
}

// Extends an enum type by this way:
export enum Status {
  Initial,
  Executing,
  Error,
  Success,
}

export enum ChangeStatusAction {
  ToInitial,
  ToExecuting,
  ToError,
  ToSuccess,
}
