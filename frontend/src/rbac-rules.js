import { appoint } from "./rbac-consts";

const rules = {
  ROLE_ADMIN: {
    static: [
      appoint.ADMIN
    ],
    dynamic: {}
  },
  ROLE_CLIENT: {
    static: [
      appoint.CLIENT
    ],
    dynamic: {}
  },
  ROLE_DOCTOR: {
    static: [
      appoint.DOCTOR
    ],
    dynamic: {}
  }
};

export default rules;
