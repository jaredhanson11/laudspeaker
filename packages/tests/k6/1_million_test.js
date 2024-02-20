// Creator: Grafana k6 Browser Recorder 1.0.1

import { sleep, group } from "k6";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";
import http from "k6/http";

export const options = {
  vus: 1,
  iterations: 1,
  httpDebug: "full",
};

// Test config
const EMAIL = "helloworld@test.com";
const FILE_PATH = "/app/data/correctness_testing.csv";
const UPLOAD_FILE = open(FILE_PATH, "b");

export default function main() {
  let response;
  let AUTHORIZATION;
  let UPLOADED_FILE_KEY;

  // STEP 1 REGISTER NEW ACCOUNT AND SETUP ACCOUNT
  response = http.post(
    "https://perf.laudspeaker.com/api/auth/register",
    `{"firstName":"Test","lastName":"Test","email":"${EMAIL}","password":"Password1$"}`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const JWT_TOKEN = response.json("access_token");
  AUTHORIZATION = `Bearer ${JWT_TOKEN}`;

  response = http.post(
    "https://perf.laudspeaker.com/api/organizations",
    '{"name":"Test","timezoneUTCOffset":"UTC-07:00"}',
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  // STEP 2 UPLOAD CUSTOMERS CSV
  response = http.post(
    "https://perf.laudspeaker.com/api/customers/uploadCSV",
    { file: http.file(UPLOAD_FILE, "upload.csv", "text/csv") },
    {
      headers: {
        authorization: AUTHORIZATION,
      },
    }
  );
  console.log(response);

  response = http.get(
    "https://perf.laudspeaker.com/api/customers/getLastImportCSV",
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  console.log(response);

  UPLOADED_FILE_KEY = response.json("fileKey");

  response = http.post(
    "https://perf.laudspeaker.com/api/customers/attributes/create",
    '{"name":"email","type":"String"}',
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  // response = http.post(
  //   "https://perf.laudspeaker.com/api/customers/attributes/count-import-preview",
  //   `{"mapping":{"name":{"head":"name","isPrimary":false,"doNotOverwrite":false},"email":{"head":"email","asAttribute":{"key":"email","type":"String","skip":false},"isPrimary":true,"doNotOverwrite":true},"source":{"head":"source","isPrimary":false,"doNotOverwrite":false},"user_id":{"head":"user_id","isPrimary":false,"doNotOverwrite":false},"is_delete":{"head":"is_delete","isPrimary":false,"doNotOverwrite":false},"is_own_car":{"head":"is_own_car","isPrimary":false,"doNotOverwrite":false},"income_type":{"head":"income_type","isPrimary":false,"doNotOverwrite":false},"credit_score":{"head":"credit_score","isPrimary":false,"doNotOverwrite":false},"bill_org_name":{"head":"bill_org_name","isPrimary":false,"doNotOverwrite":false},"revolving_amt":{"head":"revolving_amt","isPrimary":false,"doNotOverwrite":false},"chocolate_pref":{"head":"chocolate_pref","isPrimary":false,"doNotOverwrite":false},"recent_3m_appl":{"head":"recent_3m_appl","isPrimary":false,"doNotOverwrite":false},"recent_appl_date":{"head":"recent_appl_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_amt":{"head":"recent_repay_amt","isPrimary":false,"doNotOverwrite":false},"credit_score_date":{"head":"credit_score_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_count":{"head":"recent_repay_count","isPrimary":false,"doNotOverwrite":false},"member_register_time":{"head":"member_register_time","isPrimary":false,"doNotOverwrite":false},"prev_savings_exp_date":{"head":"prev_savings_exp_date","isPrimary":false,"doNotOverwrite":false},"yesterday_diff_credit_score":{"head":"yesterday_diff_credit_score","isPrimary":false,"doNotOverwrite":false}},"importOption":"NEW","fileKey":"${UPLOADED_FILE_KEY}"}`,
  //   {
  //     headers: {
  //       authorization: AUTHORIZATION,
  //       "content-type": "application/json",
  //     },
  //   }
  // );

  response = http.post(
    "https://perf.laudspeaker.com/api/customers/attributes/start-import",
    `{"mapping":{"name":{"head":"name","isPrimary":false,"doNotOverwrite":false},"email":{"head":"email","asAttribute":{"key":"email","type":"String","skip":false},"isPrimary":true,"doNotOverwrite":true},"source":{"head":"source","isPrimary":false,"doNotOverwrite":false},"user_id":{"head":"user_id","isPrimary":false,"doNotOverwrite":false},"is_delete":{"head":"is_delete","isPrimary":false,"doNotOverwrite":false},"is_own_car":{"head":"is_own_car","isPrimary":false,"doNotOverwrite":false},"income_type":{"head":"income_type","isPrimary":false,"doNotOverwrite":false},"credit_score":{"head":"credit_score","isPrimary":false,"doNotOverwrite":false},"bill_org_name":{"head":"bill_org_name","isPrimary":false,"doNotOverwrite":false},"revolving_amt":{"head":"revolving_amt","isPrimary":false,"doNotOverwrite":false},"chocolate_pref":{"head":"chocolate_pref","isPrimary":false,"doNotOverwrite":false},"recent_3m_appl":{"head":"recent_3m_appl","isPrimary":false,"doNotOverwrite":false},"recent_appl_date":{"head":"recent_appl_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_amt":{"head":"recent_repay_amt","isPrimary":false,"doNotOverwrite":false},"credit_score_date":{"head":"credit_score_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_count":{"head":"recent_repay_count","isPrimary":false,"doNotOverwrite":false},"member_register_time":{"head":"member_register_time","isPrimary":false,"doNotOverwrite":false},"prev_savings_exp_date":{"head":"prev_savings_exp_date","isPrimary":false,"doNotOverwrite":false},"yesterday_diff_credit_score":{"head":"yesterday_diff_credit_score","isPrimary":false,"doNotOverwrite":false}},"importOption":"NEW","fileKey":"${UPLOADED_FILE_KEY}"}`,
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  // STEP 3 CREATE JOURNEY

  response = http.post(
    "https://perf.laudspeaker.com/api/journeys",
    '{"name":"test"}',
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  let visualLayout = response.json("visualLayout");
  const JOURNEY_ID = response.json("id");
  //e5c17907-80c4-4006-99bb-c4ba3fe76ed3

  // response = http.get(
  //   `https://perf.laudspeaker.com/api/journeys/${JOURNEY_ID}`,
  //   {
  //     headers: {
  //       authorization: AUTHORIZATION,
  //     },
  //   }
  // );

  response = http.post(
    "https://perf.laudspeaker.com/api/steps",
    `{"type":"message","journeyID":"${JOURNEY_ID}"}`,
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  const START_STEP_NODE = visualLayout.nodes[0];
  const START_STEP_EDGE = visualLayout.edges[0];
  const MESSAGE_STEP_ID = response.json("id");

  response = http.get("https://perf.laudspeaker.com/api/templates", {
    headers: {
      authorization: AUTHORIZATION,
    },
  });
  const TEMPLATE_ONE = response.json("data")[0];
  let messageStepNode = visualLayout.nodes[1];
  messageStepNode.type = "message";
  messageStepNode.data = {
    stepId: MESSAGE_STEP_ID,
    type: "message",
    customName: "Email 1",
    template: {
      type: "email",
      selected: { id: TEMPLATE_ONE.id, name: TEMPLATE_ONE.name },
    },
  };

  response = http.post(
    "https://perf.laudspeaker.com/api/steps",
    `{"type":"exit","journeyID":"${JOURNEY_ID}"}`,
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  const EXIT_STEP_ID = response.json("id");
  const EXIT_STEP_NODE_ID = uuidv4();
  const EXIT_STEP_NODE = {
    id: EXIT_STEP_NODE_ID,
    type: "exit",
    data: {
      stepId: EXIT_STEP_ID,
    },
    position: {
      x: 0,
      y: 228,
    },
    selected: false,
  };

  const EXIT_STEP_EDGE = {
    id: `${messageStepNode.id}-${EXIT_STEP_NODE_ID}`,
    type: "primary",
    source: messageStepNode.id,
    target: EXIT_STEP_NODE_ID,
  };

  let visualLayoutBody = JSON.stringify({
    id: JOURNEY_ID,
    nodes: [START_STEP_NODE, messageStepNode, EXIT_STEP_NODE],
    edges: [START_STEP_EDGE, EXIT_STEP_EDGE],
  });

  console.log(visualLayoutBody);

  response = http.patch(
    "https://perf.laudspeaker.com/api/journeys/visual-layout",
    visualLayoutBody,
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  response = http.patch(
    "https://perf.laudspeaker.com/api/journeys",
    `{"id":"${JOURNEY_ID}","name":"test","inclusionCriteria":{"type":"allCustomers"},"isDynamic":true,"journeyEntrySettings":{"entryTiming":{"type":"WhenPublished"},"enrollmentType":"CurrentAndFutureUsers"},"journeySettings":{"tags":[],"maxEntries":{"enabled":false,"limitOnEverySchedule":false,"maxEntries":"500000"},"quietHours":{"enabled":false,"startTime":"00:00","endTime":"08:00","fallbackBehavior":"NextAvailableTime"},"maxMessageSends":{"enabled":false}}}`,
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  response = http.patch(
    `https://perf.laudspeaker.com/api/journeys/start/${JOURNEY_ID}`,
    "{}",
    {
      headers: {
        authorization: AUTHORIZATION,
        "content-type": "application/json",
      },
    }
  );

  let sentCount = 0;
  while (sentCount < 10) {
    response = http.get(
      "https://perf.laudspeaker.com/api/steps/stats/e4772a08-fbad-4cbf-959d-37e109672efb",
      {
        headers: {
          authorization: AUTHORIZATION,
        },
      }
    );
    sentCount = parseInt(response.json("sent"));
    console.log(sentCount);
  }
}
