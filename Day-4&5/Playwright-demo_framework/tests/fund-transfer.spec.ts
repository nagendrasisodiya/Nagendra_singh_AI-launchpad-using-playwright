import {test} from "@playwright/test";
import {loginUtils} from "../login-utils";
import {FundTransferPage} from "../POM/fund-transfer.page";
import data from "../test-data/fund-transfer-data.json"

test("transferAmount", async ({page}) => {
    await loginUtils(page)
    let fundTransferObj:FundTransferPage=new FundTransferPage(page)
    await fundTransferObj.fundTransferPageNav()
    await fundTransferObj.addNewBeneficiary(data)
    await fundTransferObj.transferFund(data)
    await fundTransferObj.otp()
})