import {PassportReg} from "@/utils/config";

export const userNameRule = {
  required: 'Please input name',
  minLength: {
    value: 5,
    message: "At least 5 characters.",
  },
  maxLength: {
    value: 20,
    message: "At most 20 characters.",
  },
  pattern: {
    value: /^[-_a-zA-Z0-9]*$/,
    message:
      "Only contain alphanumeric characters, hyphen(-), and underscore(_)",
  },
}

export const emailRule = {
  required: 'Please input email',
  pattern: {
    value: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
    message:
      "Pleact input a correct email",
  },
}

export const passportRule = {
  required: 'Please input passport',
  minLength: {
    value: 8,
    message: "At least 8 characters.",
  },
  maxLength: {
    value: 20,
    message: "At most 20 characters.",
  },
  pattern: {
    value: PassportReg,
    message:
      "Passport must contain uppercase, lowercase, and numbers",
  },
}

export const pathRule = {
  required: 'Please entry a path',
  pattern: {
    value: /^(\/|(\/[\w\-\.]*)+\/?)$/,
    message: "Pleact entry a correct path",
  },
}

export const portRule = {
  required: 'Please entry port',
  pattern: {
    value: /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
    message: "Pleact entry a correct port",
  },
}

export const entryPathRule = {
  required: 'Please input entry path'
}

export const nameRule = {
  illegalCharacter: (value: string) =>
    !/[^a-z0-9-]/.test(value) ||
    "The name should only contain lowercase alphanumeric character, or hyphen(-).",
  illegalStart: (value: string) =>
    /^[a-z]/.test(value) ||
    "The name should start with lowercase letter character.",
  illegalEnd: (value: string) =>
    /[a-z0-9]$/.test(value) ||
    "Then name should end with lowercase alphanumeric character.",
}

