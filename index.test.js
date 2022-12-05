const {createAccount, deposit, withdraw, balance, transfer} = require('./index.js');

// createAccount testing, expecting next account number to be 1005
test('creates an account from a fullname input', () => {
    expect(createAccount("John Cena")).toBe(1005)
})

// deposit testing, expecting account balance as output
test('deposits sum into nominated account', () => {
    expect(deposit(1001, 1500)).toBe(3000)
})

// withdraw testing, expecting account balance as output
test('withdraws sum from nominated account', () => {
    expect(withdraw(1001, 1000)).toBe(2000)
})

test('failed withdraw from nominated account, withdraw too low', () => {
    expect(withdraw(1001, 500)).toBe('Withdrawal failed for account 1001: withdrawal amount invalid. withdrawal should be between $1000 and $25000')
})

// balance testing, expecting account balance as output
test('displays nominated account balance', () => {
    expect(balance(1001)).toBe(2000)
})

// transfer testing, expecting next account number to be 1005
test('creates an account from a fullname input', () => {
    expect(transfer(1001, 1002, 1000)).toBe("Transfer successful")
})