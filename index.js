const { create } = require('domain');
var fs = require('fs');

// bank account limits/conditions
const bankAccountLimits = {
    accountLimits: [0, 100000],
    depositLimits: [500, 50000],
    withdrawLimits: [1000, 25000],
    depositCount: 3,
    withdrawCount: 3
}

// array of objects to hold bank accounts? or object of objects?
var bankAccounts = []

// to prevent duplicate bank account numbers
var bankAccountNumTracking = 1000

//reading the file and processing it into an array, to understand the different commands, do this synchronously to allow to get the data first, then use it afterwards
const readInputs = () => {
    const inputData = fs.readFileSync('./input/input-file.txt', {encoding:'utf8', flag:'r'});

    let inputArray = inputData.split(/\r?\n/);
    let commandsArray = [];
    
    inputArray.forEach(line => {
        commandsArray.push(line.split(" "));
    });

    return commandsArray;
}

// functions for each command, better segregation, call them when needed

const createAccount = (fullName) => {
    bankAccountNumTracking +=1

    var newBankAccount = {
        accountName: fullName,
        accountNumber: bankAccountNumTracking,
        accountBalance: 0,
        depositRemaining: 3,
        withdrawRemaining: 3
    }

    bankAccounts.push(newBankAccount)

    return bankAccountNumTracking;
} 

const deposit = (accountNumber, depositAmount) => {

    const accountIndex = bankAccounts.findIndex(account => {
        return account.accountNumber == accountNumber;
    })

    // validate bank account number
    if (accountIndex != -1) {
        // check number of deposits remaining
        if (bankAccounts[accountIndex].depositRemaining > 0) {
            // check bank balance conditions
            if ((bankAccounts[accountIndex].accountBalance + parseInt(depositAmount)) <= bankAccountLimits.accountLimits[1]) {
                // check deposit conditions
                if ((parseInt(depositAmount) > bankAccountLimits.depositLimits[0]) && (parseInt(depositAmount) < bankAccountLimits.depositLimits[1])) {
                    bankAccounts[accountIndex].accountBalance += parseInt(depositAmount);
                    bankAccounts[accountIndex].depositRemaining -= 1;

                    // console.log(bankAccounts[accountIndex].accountBalance);
                    return bankAccounts[accountIndex].accountBalance;

                } else {
                    return `Deposit failed for account ${accountNumber}: Deposit amount invalid. Deposit should be between $${bankAccountLimits.depositLimits[0]} and $${bankAccountLimits.depositLimits[1]}`;
                }
            } else {
                return `Deposit failed for account ${accountNumber}: Bank account upper limit of $${bankAccountLimits.accountLimits[1]} reached.`;
            }
        } else {
            return `Deposit failed for account ${accountNumber}: Maximum number of deposits reached for today.`;
        }
    } else {
        return `Deposit failed for account ${accountNumber}: Please enter a valid bank account number.`;
    }
} 

const withdraw = (accountNumber, withdrawAmount) => {

    const accountIndex = bankAccounts.findIndex(account => {
        return account.accountNumber == accountNumber;
    })

    // validate bank account number
    if (accountIndex != -1) {
        // check number of withdrawals remaining
        if (bankAccounts[accountIndex].withdrawRemaining > 0) {
            // check bank balance conditions
            if ((bankAccounts[accountIndex].accountBalance - parseInt(withdrawAmount)) >= bankAccountLimits.accountLimits[0]) {
                // check withdrawal conditions
                if ((parseInt(withdrawAmount) >= bankAccountLimits.withdrawLimits[0]) && (parseInt(withdrawAmount) <= bankAccountLimits.withdrawLimits[1])) {
                    bankAccounts[accountIndex].accountBalance -= parseInt(withdrawAmount);
                    bankAccounts[accountIndex].withdrawRemaining -= 1;

                    // console.log(bankAccounts[accountIndex].accountBalance);
                    return bankAccounts[accountIndex].accountBalance;

                } else {
                    return `Withdrawal failed for account ${accountNumber}: withdrawal amount invalid. withdrawal should be between $${bankAccountLimits.withdrawLimits[0]} and $${bankAccountLimits.withdrawLimits[1]}`;
                }
            } else {
                return `Withdrawal failed for account ${accountNumber}: Bank account lower limit of $${bankAccountLimits.accountLimits[0]} reached.`;
            }
        } else {
            return `Withdrawal failed for account ${accountNumber}: Maximum number of withdrawals reached for today.`;
        }
    } else {
        return `Withdrawal failed for account ${accountNumber}: Please enter a valid bank account number.`;
    }

} 

const balance = (accountNumber) => {

    const accountIndex = bankAccounts.findIndex(account => {
        return account.accountNumber == accountNumber;
    })

    // validate bank account number
    if (accountIndex != -1) {
        // console.log(bankAccounts[accountIndex].accountBalance);
        return bankAccounts[accountIndex].accountBalance;
    } else {
        return `Unable to display bank balance for account ${accountNumber}: Please enter a valid bank account number.`;
    }

} 

const transfer = (sourceAccountNumber, targetAccountNumber, transferAmount) => {

    const sourceAccountIndex = bankAccounts.findIndex(account => {
        return account.accountNumber == sourceAccountNumber;
    })

    const targetAccountIndex = bankAccounts.findIndex(account => {
        return account.accountNumber == targetAccountNumber;
    })

    // validate bank accounts 
    if ((sourceAccountIndex != -1) && (targetAccountIndex != -1)) {
        if ((bankAccounts[sourceAccountIndex].accountBalance - parseInt(transferAmount)) >= bankAccountLimits.accountLimits[0]) {
            if ((bankAccounts[targetAccountIndex].accountBalance + parseInt(transferAmount)) <= bankAccountLimits.accountLimits[1]) {
                bankAccounts[sourceAccountIndex].accountBalance -= parseInt(transferAmount);
                bankAccounts[targetAccountIndex].accountBalance += parseInt(transferAmount);

                // console.log("Transfer successful");
                return "Transfer successful";
            } else {
                return `Transfer failed: Maximum funds reached in bank account ${targetAccountNumber}.`;
            }
        } else {
            return `Transfer failed: Insufficient funds in bank account ${sourceAccountNumber}.`;
        }
    } else {
        return `Transfer failed: Please enter valid bank account numbers.`;
    }
} 

const processInputs = () => {
    
    readInputs().forEach((commandLine) => {

        let mainCommand = commandLine[0]

        switch(mainCommand) {
            case "Create":
                // string manipulation to combine first and last name, and remove quotations
                var fullName = `${commandLine[1].slice(1)} ${commandLine[2].slice(0,commandLine[2].length-1)}`

                createAccount(fullName)
                break;
            case "Deposit":
                var accountNumber = commandLine[1]
                var depositAmount = commandLine[2]

                deposit(accountNumber, depositAmount);
                break;
            case "Withdraw":
                var accountNumber = commandLine[1]
                var withdrawAmount = commandLine[2]

                withdraw(accountNumber, withdrawAmount);
                break;
            case "Balance":
                var accountNumber = commandLine[1]

                balance(accountNumber);
                break;
            case "Transfer":
                var sourceAccountNumber = commandLine[1]
                var targetAccountNumber = commandLine[2]
                var transferAmount = commandLine[3]

                transfer(sourceAccountNumber, targetAccountNumber, transferAmount);
                break;
    
          }

    })
    console.log(bankAccounts)
    return bankAccounts;
}

processInputs(readInputs);

module.exports = {createAccount, deposit, withdraw, balance, transfer};