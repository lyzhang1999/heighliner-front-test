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
    value: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
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
  required: 'Please input a path',
  pattern: {
    value: /^\/(\w+\/?)+$/,
    message: "Pleact input a correct path",
  },
}

export const portRule = {
  required: 'Please input a port',
  pattern: {
    value: /^([1-9]|[1-5]\d{4}|6[1-4]\d{3}|65[1-4]\d{2}|655[1-2]\d|6553[1-5])$/,
    message: "Pleact input a correct port",
  },
}

