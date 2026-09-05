import {Locator, Page} from "@playwright/test";

export class FundTransferPage{
    page:Page
    fundTransferNAV:Locator
    transferTypeDRPD:Locator
    fromAccountDRPD:Locator
    toAccountDRPD:Locator
    transferAmountIPF:Locator
    executeTransferBTN:Locator
    initiateWireBTN:Locator
    recipientBeneficiaryDRPD:Locator
    // add beneficiary
    addBeneficiaryBTN:Locator
    beneficiaryFullNameIPF:Locator
    newBeneficiaryAccountNoIPF:Locator
    newBeneficiaryBankNameDRPD:Locator
    saveBeneficiaryBTN:Locator
    //otp
    readOtp:Locator
    otpTF:Locator
    verifyOTP:Locator
    constructor(page:Page) {
        this.page = page
        this.fundTransferNAV= page.getByRole('button', { name: 'Funds Transfer' })
        this.transferTypeDRPD= page.locator('#transfer-type')
        this.fromAccountDRPD= page.locator('#from-acc')
        this.toAccountDRPD= page.locator('#to-acc')
        this.recipientBeneficiaryDRPD= page.locator('#bene-select')
        this.transferAmountIPF= page.locator('#transfer-amount')
        this.executeTransferBTN= page.getByRole('button', { name: 'Execute Transfer' })
        this.initiateWireBTN= page.getByRole('button', { name: 'Initiate Wire' })
        this.addBeneficiaryBTN= page.getByRole('button', { name: 'Add New' })
        this.beneficiaryFullNameIPF= page.getByRole('textbox', { name: 'e.g. John Doe' })
        this.newBeneficiaryAccountNoIPF= page.getByRole('textbox', { name: 'e.g. 1234567890' })
        this.newBeneficiaryBankNameDRPD= page.locator('#bene-bank')
        this.saveBeneficiaryBTN= page.getByRole('button', { name: 'Save Beneficiary' })

        this.readOtp=page.locator('.otp-display-code')
        this.otpTF=page.getByRole('textbox', { name: 'Enter 6-digit OTP' })
        this.verifyOTP=page.getByRole('button', { name: 'Verify' })
    }
    async fundTransferPageNav() {
        await this.fundTransferNAV.click()
    }
    async addNewBeneficiary(data:any) {
        await this.addBeneficiaryBTN.click()
        await this.beneficiaryFullNameIPF.fill(data.Beneficiary.fullName)
        await this.newBeneficiaryAccountNoIPF.fill(data.Beneficiary.accNo)
        await this.newBeneficiaryBankNameDRPD.selectOption({label:data.Beneficiary.bankName})
        await this.saveBeneficiaryBTN.click()
    }
    async transferFund(data:any) {
        await this.transferTypeDRPD.selectOption({label:data.transferFunds.transferType})
        await this.recipientBeneficiaryDRPD.selectOption({label:data.transferFunds.beni})
        await this.transferAmountIPF.fill(data.transferFunds.transferAmount)
        await this.initiateWireBTN.click()
    }
    async otp(){
        const ot=await this.readOtp.innerText()
        await this.otpTF.fill(ot)
        await this.verifyOTP.click()
    }
}