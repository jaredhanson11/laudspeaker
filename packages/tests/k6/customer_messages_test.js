import { sleep, group } from "k6";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";
import http from "k6/http";
import { createAccount } from "./utils/accounts.js";
import { Reporter } from "./utils/common.js";

export const options = {
  vus: 1,
  iterations: 1,
  throw: true,
};

// Test config
const EMAIL = `test${Math.random()}@test.com`;
const UPLOAD_FILE = open(__ENV.CSV_FILEPATH, "b");
const POLLING_MINUTES = 1;
const PRIMARY_KEY_HEADER = "user_id";

export default function main() {
  let response;
  let UPLOADED_FILE_KEY;

  let reporter = new Reporter("SETUP");
  reporter.addTimer("totalElapsed", "Total elapsed time of k6 test");
  reporter.report(`Started script with email: ${EMAIL} and file ${FILE_PATH}.`);

  reporter.setStep("CREATE_ACCOUNT");
  reporter.addTimer("createAccount", "Elapsed time of create account");
  reporter.log(`Creating account and organization`);

  // CREATE ACCOUNT
  let { authorization, email } = createAccount(EMAIL);

  reporter.report(`Finished creating account and organization.`);
  reporter.log(`Email: ${email}`);
  reporter.log(`Authorization header: ${authorization}`);
  reporter.removeTimer("createAccount");

  reporter.setStep("CUSTOMER_IMPORT");
  reporter.report(`Starting customer import`);
  reporter.addTimer("customerImport", "Total elapsed time of customer import");
  reporter.addTimer("csvUpload", "Total elapsed time of csv upload");

  response = http.post(
    "https://perf.laudspeaker.com/api/customers/uploadCSV",
    { file: http.file(UPLOAD_FILE, "upload.csv", "text/csv") },
    {
      timeout: "600s",
      headers: {
        authorization,
      },
    }
  );

  response = http.get(
    "https://perf.laudspeaker.com/api/customers/getLastImportCSV",
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );

  UPLOADED_FILE_KEY = response.json("fileKey");
  reporter.report(`CSV upload finished with fileKey: ${UPLOADED_FILE_KEY}`);
  reporter.removeTimer("csvUpload");

  reporter.log(`Creating customer attributes`);
  response = http.post(
    "https://perf.laudspeaker.com/api/customers/attributes/create",
    '{"name":"${PRIMARY_KEY_HEADER}","type":"String"}',
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );

  response = http.post(
    "https://perf.laudspeaker.com/api/customers/attributes/count-import-preview",
    `{ "mapping": { "${PRIMARY_KEY_HEADER}": { "head": "${PRIMARY_KEY_HEADER}", "asAttribute": { "key": "${PRIMARY_KEY_HEADER}", "type": "String", "skip": false }, "isPrimary": true, "doNotOverwrite": true } }, "importOption": "NEW", "fileKey": "${UPLOADED_FILE_KEY}" }`,
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );

  const NUM_CUSTOMERS = 10;
  reporter.log(`New customers: ${NUM_CUSTOMERS}`);

  // df2 import
  // `{"mapping":{"dsr":{"head":"dsr","isPrimary":false,"doNotOverwrite":false},"is_apt":{"head":"is_apt","isPrimary":false,"doNotOverwrite":false},"source":{"head":"source","isPrimary":false,"doNotOverwrite":false},"user_id":{"head":"user_id","asAttribute":{"key":"user_id","type":"String","skip":false},"isPrimary":true,"doNotOverwrite":true},"is_delete":{"head":"is_delete","isPrimary":false,"doNotOverwrite":false},"mkt_agree":{"head":"mkt_agree","isPrimary":false,"doNotOverwrite":false},"dsr_source":{"head":"dsr_source","isPrimary":false,"doNotOverwrite":false},"is_own_car":{"head":"is_own_car","isPrimary":false,"doNotOverwrite":false},"loan_count":{"head":"loan_count","isPrimary":false,"doNotOverwrite":false},"income_type":{"head":"income_type","isPrimary":false,"doNotOverwrite":false},"is_kcb_link":{"head":"is_kcb_link","isPrimary":false,"doNotOverwrite":false},"company_name":{"head":"company_name","isPrimary":false,"doNotOverwrite":false},"credit_score":{"head":"credit_score","isPrimary":false,"doNotOverwrite":false},"is_d7_review":{"head":"is_d7_review","isPrimary":false,"doNotOverwrite":false},"is_donotcall":{"head":"is_donotcall","isPrimary":false,"doNotOverwrite":false},"add_org_agree":{"head":"add_org_agree","isPrimary":false,"doNotOverwrite":false},"bill_org_name":{"head":"bill_org_name","isPrimary":false,"doNotOverwrite":false},"houseown_type":{"head":"houseown_type","isPrimary":false,"doNotOverwrite":false},"is_ln_bal_chg":{"head":"is_ln_bal_chg","isPrimary":false,"doNotOverwrite":false},"ovd_prv_agree":{"head":"ovd_prv_agree","isPrimary":false,"doNotOverwrite":false},"revolving_amt":{"head":"revolving_amt","isPrimary":false,"doNotOverwrite":false},"var_loan_rate":{"head":"var_loan_rate","isPrimary":false,"doNotOverwrite":false},"card_bill_date":{"head":"card_bill_date","isPrimary":false,"doNotOverwrite":false},"is_ln_acct_cls":{"head":"is_ln_acct_cls","isPrimary":false,"doNotOverwrite":false},"is_ln_acct_opn":{"head":"is_ln_acct_opn","isPrimary":false,"doNotOverwrite":false},"is_mydata_link":{"head":"is_mydata_link","isPrimary":false,"doNotOverwrite":false},"recent_1m_appl":{"head":"recent_1m_appl","isPrimary":false,"doNotOverwrite":false},"recent_3m_appl":{"head":"recent_3m_appl","isPrimary":false,"doNotOverwrite":false},"recent_7d_appl":{"head":"recent_7d_appl","isPrimary":false,"doNotOverwrite":false},"is_crd_card_cxl":{"head":"is_crd_card_cxl","isPrimary":false,"doNotOverwrite":false},"is_crd_card_del":{"head":"is_crd_card_del","isPrimary":false,"doNotOverwrite":false},"is_crd_card_reg":{"head":"is_crd_card_reg","isPrimary":false,"doNotOverwrite":false},"kcb_change_date":{"head":"kcb_change_date","isPrimary":false,"doNotOverwrite":false},"overdue_bal_amt":{"head":"overdue_bal_amt","isPrimary":false,"doNotOverwrite":false},"recent_exp_date":{"head":"recent_exp_date","isPrimary":false,"doNotOverwrite":false},"recent_kcb_date":{"head":"recent_kcb_date","isPrimary":false,"doNotOverwrite":false},"is_repay_account":{"head":"is_repay_account","isPrimary":false,"doNotOverwrite":false},"my_ln_info_agree":{"head":"my_ln_info_agree","isPrimary":false,"doNotOverwrite":false},"recent_appl_date":{"head":"recent_appl_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_amt":{"head":"recent_repay_amt","isPrimary":false,"doNotOverwrite":false},"credit_score_date":{"head":"credit_score_date","isPrimary":false,"doNotOverwrite":false},"is_ln_overdue_cls":{"head":"is_ln_overdue_cls","isPrimary":false,"doNotOverwrite":false},"is_ln_overdue_del":{"head":"is_ln_overdue_del","isPrimary":false,"doNotOverwrite":false},"is_ln_overdue_reg":{"head":"is_ln_overdue_reg","isPrimary":false,"doNotOverwrite":false},"is_nextweek_repay":{"head":"is_nextweek_repay","isPrimary":false,"doNotOverwrite":false},"recent_repay_date":{"head":"recent_repay_date","isPrimary":false,"doNotOverwrite":false},"is_exp_1_week_left":{"head":"is_exp_1_week_left","isPrimary":false,"doNotOverwrite":false},"is_exp_2_week_left":{"head":"is_exp_2_week_left","isPrimary":false,"doNotOverwrite":false},"recent_1m_contract":{"head":"recent_1m_contract","isPrimary":false,"doNotOverwrite":false},"recent_3m_contract":{"head":"recent_3m_contract","isPrimary":false,"doNotOverwrite":false},"recent_7d_contract":{"head":"recent_7d_contract","isPrimary":false,"doNotOverwrite":false},"recent_mydata_date":{"head":"recent_mydata_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_count":{"head":"recent_repay_count","isPrimary":false,"doNotOverwrite":false},"recent_review_date":{"head":"recent_review_date","isPrimary":false,"doNotOverwrite":false},"company_enter_month":{"head":"company_enter_month","isPrimary":false,"doNotOverwrite":false},"is_card_overdue_cls":{"head":"is_card_overdue_cls","isPrimary":false,"doNotOverwrite":false},"is_card_overdue_del":{"head":"is_card_overdue_del","isPrimary":false,"doNotOverwrite":false},"is_card_overdue_reg":{"head":"is_card_overdue_reg","isPrimary":false,"doNotOverwrite":false},"is_exp_1_month_left":{"head":"is_exp_1_month_left","isPrimary":false,"doNotOverwrite":false},"is_exp_2_month_left":{"head":"is_exp_2_month_left","isPrimary":false,"doNotOverwrite":false},"is_mydata_incomplete":{"head":"is_mydata_incomplete","isPrimary":false,"doNotOverwrite":false},"member_register_time":{"head":"member_register_time","isPrimary":false,"doNotOverwrite":false},"recent_contract_date":{"head":"recent_contract_date","isPrimary":false,"doNotOverwrite":false},"next_savings_exp_date":{"head":"next_savings_exp_date","isPrimary":false,"doNotOverwrite":false},"nextweek_repay_amount":{"head":"nextweek_repay_amount","isPrimary":false,"doNotOverwrite":false},"prev_savings_exp_date":{"head":"prev_savings_exp_date","isPrimary":false,"doNotOverwrite":false},"is_kcb_more_than_mydata":{"head":"is_kcb_more_than_mydata","isPrimary":false,"doNotOverwrite":false},"mydata_consent_end_date":{"head":"mydata_consent_end_date","isPrimary":false,"doNotOverwrite":false},"int_rate_increase_org_name":{"head":"int_rate_increase_org_name","isPrimary":false,"doNotOverwrite":false},"recent_refinance_appl_date":{"head":"recent_refinance_appl_date","isPrimary":false,"doNotOverwrite":false},"count_refinancing_condition":{"head":"count_refinancing_condition","isPrimary":false,"doNotOverwrite":false},"int_rate_increase_prod_name":{"head":"int_rate_increase_prod_name","isPrimary":false,"doNotOverwrite":false},"yesterday_diff_credit_score":{"head":"yesterday_diff_credit_score","isPrimary":false,"doNotOverwrite":false},"is_direct_refinancing_target":{"head":"is_direct_refinancing_target","isPrimary":false,"doNotOverwrite":false},"recent_refinance_contract_date":{"head":"recent_refinance_contract_date","isPrimary":false,"doNotOverwrite":false},"count_direct_refinancing_condition":{"head":"count_direct_refinancing_condition","isPrimary":false,"doNotOverwrite":false},"recent_direct_refinance_contract_date":{"head":"recent_direct_refinance_contract_date","isPrimary":false,"doNotOverwrite":false},"is_direct_refinancing_contract_before_15days":{"head":"is_direct_refinancing_contract_before_15days","isPrimary":false,"doNotOverwrite":false},"is_direct_refinancing_contract_before_6months":{"head":"is_direct_refinancing_contract_before_6months","isPrimary":false,"doNotOverwrite":false},"is_direct_refinancing_repayday_account_yesterday":{"head":"is_direct_refinancing_repayday_account_yesterday","isPrimary":false,"doNotOverwrite":false}},"importOption":"NEW","fileKey":"${UPLOADED_FILE_KEY}"}`

  // correctness_testing
  // `{"mapping":{"name":{"head":"name","isPrimary":false,"doNotOverwrite":false},"email":{"head":"email","asAttribute":{"key":"email","type":"String","skip":false},"isPrimary":true,"doNotOverwrite":true},"source":{"head":"source","isPrimary":false,"doNotOverwrite":false},"user_id":{"head":"user_id","isPrimary":false,"doNotOverwrite":false},"is_delete":{"head":"is_delete","isPrimary":false,"doNotOverwrite":false},"is_own_car":{"head":"is_own_car","isPrimary":false,"doNotOverwrite":false},"income_type":{"head":"income_type","isPrimary":false,"doNotOverwrite":false},"credit_score":{"head":"credit_score","isPrimary":false,"doNotOverwrite":false},"bill_org_name":{"head":"bill_org_name","isPrimary":false,"doNotOverwrite":false},"revolving_amt":{"head":"revolving_amt","isPrimary":false,"doNotOverwrite":false},"chocolate_pref":{"head":"chocolate_pref","isPrimary":false,"doNotOverwrite":false},"recent_3m_appl":{"head":"recent_3m_appl","isPrimary":false,"doNotOverwrite":false},"recent_appl_date":{"head":"recent_appl_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_amt":{"head":"recent_repay_amt","isPrimary":false,"doNotOverwrite":false},"credit_score_date":{"head":"credit_score_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_count":{"head":"recent_repay_count","isPrimary":false,"doNotOverwrite":false},"member_register_time":{"head":"member_register_time","isPrimary":false,"doNotOverwrite":false},"prev_savings_exp_date":{"head":"prev_savings_exp_date","isPrimary":false,"doNotOverwrite":false},"yesterday_diff_credit_score":{"head":"yesterday_diff_credit_score","isPrimary":false,"doNotOverwrite":false}},"importOption":"NEW","fileKey":"${UPLOADED_FILE_KEY}"}`,

  reporter.report(`Starting import for fileKey: ${UPLOADED_FILE_KEY}`);
  reporter.addTimer(
    "startImport",
    "Time elapsed of import process (not including csv upload)"
  );
  response = http.post(
    "https://perf.laudspeaker.com/api/customers/attributes/start-import",
    `{"mapping":{"dsr":{"head":"dsr","isPrimary":false,"doNotOverwrite":false},"is_apt":{"head":"is_apt","isPrimary":false,"doNotOverwrite":false},"source":{"head":"source","isPrimary":false,"doNotOverwrite":false},"user_id":{"head":"user_id","asAttribute":{"key":"user_id","type":"String","skip":false},"isPrimary":true,"doNotOverwrite":true},"is_delete":{"head":"is_delete","isPrimary":false,"doNotOverwrite":false},"mkt_agree":{"head":"mkt_agree","isPrimary":false,"doNotOverwrite":false},"dsr_source":{"head":"dsr_source","isPrimary":false,"doNotOverwrite":false},"is_own_car":{"head":"is_own_car","isPrimary":false,"doNotOverwrite":false},"loan_count":{"head":"loan_count","isPrimary":false,"doNotOverwrite":false},"income_type":{"head":"income_type","isPrimary":false,"doNotOverwrite":false},"is_kcb_link":{"head":"is_kcb_link","isPrimary":false,"doNotOverwrite":false},"company_name":{"head":"company_name","isPrimary":false,"doNotOverwrite":false},"credit_score":{"head":"credit_score","isPrimary":false,"doNotOverwrite":false},"is_d7_review":{"head":"is_d7_review","isPrimary":false,"doNotOverwrite":false},"is_donotcall":{"head":"is_donotcall","isPrimary":false,"doNotOverwrite":false},"add_org_agree":{"head":"add_org_agree","isPrimary":false,"doNotOverwrite":false},"bill_org_name":{"head":"bill_org_name","isPrimary":false,"doNotOverwrite":false},"houseown_type":{"head":"houseown_type","isPrimary":false,"doNotOverwrite":false},"is_ln_bal_chg":{"head":"is_ln_bal_chg","isPrimary":false,"doNotOverwrite":false},"ovd_prv_agree":{"head":"ovd_prv_agree","isPrimary":false,"doNotOverwrite":false},"revolving_amt":{"head":"revolving_amt","isPrimary":false,"doNotOverwrite":false},"var_loan_rate":{"head":"var_loan_rate","isPrimary":false,"doNotOverwrite":false},"card_bill_date":{"head":"card_bill_date","isPrimary":false,"doNotOverwrite":false},"is_ln_acct_cls":{"head":"is_ln_acct_cls","isPrimary":false,"doNotOverwrite":false},"is_ln_acct_opn":{"head":"is_ln_acct_opn","isPrimary":false,"doNotOverwrite":false},"is_mydata_link":{"head":"is_mydata_link","isPrimary":false,"doNotOverwrite":false},"recent_1m_appl":{"head":"recent_1m_appl","isPrimary":false,"doNotOverwrite":false},"recent_3m_appl":{"head":"recent_3m_appl","isPrimary":false,"doNotOverwrite":false},"recent_7d_appl":{"head":"recent_7d_appl","isPrimary":false,"doNotOverwrite":false},"is_crd_card_cxl":{"head":"is_crd_card_cxl","isPrimary":false,"doNotOverwrite":false},"is_crd_card_del":{"head":"is_crd_card_del","isPrimary":false,"doNotOverwrite":false},"is_crd_card_reg":{"head":"is_crd_card_reg","isPrimary":false,"doNotOverwrite":false},"kcb_change_date":{"head":"kcb_change_date","isPrimary":false,"doNotOverwrite":false},"overdue_bal_amt":{"head":"overdue_bal_amt","isPrimary":false,"doNotOverwrite":false},"recent_exp_date":{"head":"recent_exp_date","isPrimary":false,"doNotOverwrite":false},"recent_kcb_date":{"head":"recent_kcb_date","isPrimary":false,"doNotOverwrite":false},"is_repay_account":{"head":"is_repay_account","isPrimary":false,"doNotOverwrite":false},"my_ln_info_agree":{"head":"my_ln_info_agree","isPrimary":false,"doNotOverwrite":false},"recent_appl_date":{"head":"recent_appl_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_amt":{"head":"recent_repay_amt","isPrimary":false,"doNotOverwrite":false},"credit_score_date":{"head":"credit_score_date","isPrimary":false,"doNotOverwrite":false},"is_ln_overdue_cls":{"head":"is_ln_overdue_cls","isPrimary":false,"doNotOverwrite":false},"is_ln_overdue_del":{"head":"is_ln_overdue_del","isPrimary":false,"doNotOverwrite":false},"is_ln_overdue_reg":{"head":"is_ln_overdue_reg","isPrimary":false,"doNotOverwrite":false},"is_nextweek_repay":{"head":"is_nextweek_repay","isPrimary":false,"doNotOverwrite":false},"recent_repay_date":{"head":"recent_repay_date","isPrimary":false,"doNotOverwrite":false},"is_exp_1_week_left":{"head":"is_exp_1_week_left","isPrimary":false,"doNotOverwrite":false},"is_exp_2_week_left":{"head":"is_exp_2_week_left","isPrimary":false,"doNotOverwrite":false},"recent_1m_contract":{"head":"recent_1m_contract","isPrimary":false,"doNotOverwrite":false},"recent_3m_contract":{"head":"recent_3m_contract","isPrimary":false,"doNotOverwrite":false},"recent_7d_contract":{"head":"recent_7d_contract","isPrimary":false,"doNotOverwrite":false},"recent_mydata_date":{"head":"recent_mydata_date","isPrimary":false,"doNotOverwrite":false},"recent_repay_count":{"head":"recent_repay_count","isPrimary":false,"doNotOverwrite":false},"recent_review_date":{"head":"recent_review_date","isPrimary":false,"doNotOverwrite":false},"company_enter_month":{"head":"company_enter_month","isPrimary":false,"doNotOverwrite":false},"is_card_overdue_cls":{"head":"is_card_overdue_cls","isPrimary":false,"doNotOverwrite":false},"is_card_overdue_del":{"head":"is_card_overdue_del","isPrimary":false,"doNotOverwrite":false},"is_card_overdue_reg":{"head":"is_card_overdue_reg","isPrimary":false,"doNotOverwrite":false},"is_exp_1_month_left":{"head":"is_exp_1_month_left","isPrimary":false,"doNotOverwrite":false},"is_exp_2_month_left":{"head":"is_exp_2_month_left","isPrimary":false,"doNotOverwrite":false},"is_mydata_incomplete":{"head":"is_mydata_incomplete","isPrimary":false,"doNotOverwrite":false},"member_register_time":{"head":"member_register_time","isPrimary":false,"doNotOverwrite":false},"recent_contract_date":{"head":"recent_contract_date","isPrimary":false,"doNotOverwrite":false},"next_savings_exp_date":{"head":"next_savings_exp_date","isPrimary":false,"doNotOverwrite":false},"nextweek_repay_amount":{"head":"nextweek_repay_amount","isPrimary":false,"doNotOverwrite":false},"prev_savings_exp_date":{"head":"prev_savings_exp_date","isPrimary":false,"doNotOverwrite":false},"is_kcb_more_than_mydata":{"head":"is_kcb_more_than_mydata","isPrimary":false,"doNotOverwrite":false},"mydata_consent_end_date":{"head":"mydata_consent_end_date","isPrimary":false,"doNotOverwrite":false},"int_rate_increase_org_name":{"head":"int_rate_increase_org_name","isPrimary":false,"doNotOverwrite":false},"recent_refinance_appl_date":{"head":"recent_refinance_appl_date","isPrimary":false,"doNotOverwrite":false},"count_refinancing_condition":{"head":"count_refinancing_condition","isPrimary":false,"doNotOverwrite":false},"int_rate_increase_prod_name":{"head":"int_rate_increase_prod_name","isPrimary":false,"doNotOverwrite":false},"yesterday_diff_credit_score":{"head":"yesterday_diff_credit_score","isPrimary":false,"doNotOverwrite":false},"is_direct_refinancing_target":{"head":"is_direct_refinancing_target","isPrimary":false,"doNotOverwrite":false},"recent_refinance_contract_date":{"head":"recent_refinance_contract_date","isPrimary":false,"doNotOverwrite":false},"count_direct_refinancing_condition":{"head":"count_direct_refinancing_condition","isPrimary":false,"doNotOverwrite":false},"recent_direct_refinance_contract_date":{"head":"recent_direct_refinance_contract_date","isPrimary":false,"doNotOverwrite":false},"is_direct_refinancing_contract_before_15days":{"head":"is_direct_refinancing_contract_before_15days","isPrimary":false,"doNotOverwrite":false},"is_direct_refinancing_contract_before_6months":{"head":"is_direct_refinancing_contract_before_6months","isPrimary":false,"doNotOverwrite":false},"is_direct_refinancing_repayday_account_yesterday":{"head":"is_direct_refinancing_repayday_account_yesterday","isPrimary":false,"doNotOverwrite":false}},"importOption":"NEW","fileKey":"${UPLOADED_FILE_KEY}"}`,
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );

  // Verify upload finished
  let numPages = 0;
  let expectedPages = Math.floor(NUM_CUSTOMERS / 10);

  while (numPages < expectedPages) {
    response = http.get(
      "https://perf.laudspeaker.com/api/customers?take=10&skip=0&searchKey=&searchValue=&orderBy=createdAt&orderType=desc",
      {
        headers: {
          authorization,
        },
      }
    );
    numPages = parseInt(response.json("totalPages"));
    reporter.report(
      `Checking status of customer import. ${numPages} pages imported. ${expectedPages} pages expected.`
    );
    if (numPages < expectedPages) sleep(30);
  }
  reporter.report(
    `Customer import process completed. ${numPages} customer pages loaded.`
  );
  reporter.removeTimer("startImport");
  reporter.removeTimer("customerImport");

  // STEP 3 CREATE JOURNEY

  reporter.setStep("JOURNEY_CREATION");
  reporter.log(`Starting journey creation`);
  reporter.addTimer(
    "journeyCreation",
    "Time elapsed to create a simple journey"
  );
  reporter.log(`Posting new journey`);
  response = http.post(
    "https://perf.laudspeaker.com/api/journeys",
    '{"name":"test"}',
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );
  let visualLayout = response.json("visualLayout");
  const JOURNEY_ID = response.json("id");

  reporter.log(`Journey created with id: ${JOURNEY_ID}`);

  response = http.post(
    "https://perf.laudspeaker.com/api/steps",
    `{"type":"message","journeyID":"${JOURNEY_ID}"}`,
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );

  const START_STEP_NODE = visualLayout.nodes[0];
  const START_STEP_EDGE = visualLayout.edges[0];
  const MESSAGE_STEP_ID = response.json("id");

  response = http.get("https://perf.laudspeaker.com/api/templates", {
    headers: {
      authorization,
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
        authorization,
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

  response = http.patch(
    "https://perf.laudspeaker.com/api/journeys/visual-layout",
    visualLayoutBody,
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );

  response = http.patch(
    "https://perf.laudspeaker.com/api/journeys",
    `{"id":"${JOURNEY_ID}","name":"test","inclusionCriteria":{"type":"allCustomers"},"isDynamic":true,"journeyEntrySettings":{"entryTiming":{"type":"WhenPublished"},"enrollmentType":"CurrentAndFutureUsers"},"journeySettings":{"tags":[],"maxEntries":{"enabled":false,"limitOnEverySchedule":false,"maxEntries":"500000"},"quietHours":{"enabled":false,"startTime":"00:00","endTime":"08:00","fallbackBehavior":"NextAvailableTime"},"maxMessageSends":{"enabled":false}}}`,
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );
  reporter.report(`Journey creation completed.`);
  reporter.removeTimer("journeyCreation");

  reporter.setStep("CUSTOMER_MESSAGING");
  reporter.log(`Starting journey.`);
  reporter.addTimer(
    "journeyMessaging",
    "Time elapsed since journey started triggering customer messages."
  );

  response = http.patch(
    `https://perf.laudspeaker.com/api/journeys/start/${JOURNEY_ID}`,
    "{}",
    {
      headers: {
        authorization,
        "content-type": "application/json",
      },
    }
  );
  reporter.report(`Journey started.`);

  reporter.log(
    `Check stats: https://perf.laudspeaker.com/api/steps/stats/${MESSAGE_STEP_ID}`
  );

  let sentCount = 0;
  let retries = 0; // kill stat checking early if sent count not increasing
  let prevSentCount = 0;
  while (sentCount < NUM_CUSTOMERS) {
    response = http.get(
      `https://perf.laudspeaker.com/api/steps/stats/${MESSAGE_STEP_ID}`,
      {
        headers: {
          authorization,
        },
      }
    );
    prevSentCount = sentCount;
    sentCount = parseInt(response.json("sent"));
    reporter.report(`Current sent messages: ${sentCount} of ${NUM_CUSTOMERS}`);
    if (sentCount < NUM_CUSTOMERS) {
      sleep(POLLING_MINUTES * 60);
      if (prevSentCount === sentCount) {
        reporter.log(
          `Sent count hasn't increased since last poll. Current count: ${sentCount}. number of retries: ${retries}`
        );
        if (retries > 5) {
          reporter.report(
            `Sent count hasn't increased in 5 retries. Failing test...`
          );
          fail();
          break;
        }
        retries = retries + 1;
      } else {
        retries = 0;
      }
    }
  }
  reporter.report(`Test successfully finished.`);
  reporter.log(`Final sentCount: ${sentCount}.`);
  reporter.removeTimer("journeyMessaging");

  reporter.log(`Cleaning up account... TODO`);
}
