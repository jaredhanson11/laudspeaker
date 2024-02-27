import http from "k6/http";
import { postOrFail } from "./common.js";
export function createAccount(email = undefined) {
  let registerResponse = postOrFail(
    "https://perf.laudspeaker.com/api/auth/register",
    `{"firstName":"Test","lastName":"Test","email":"${email}","password":"Password1$"}`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );

  let authorization = `Bearer ${registerResponse.json("access_token")}`;
  let organizatonResponse = postOrFail(
    "https://perf.laudspeaker.com/api/organizations",
    '{"name":"Test","timezoneUTCOffset":"UTC-07:00"}',
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );
  return { email, authorization };
}

export function deleteAccount(authorization) {
  // pass
}
