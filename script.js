/**
* Calculate a loan period for a mortgage.
* @param {*} amount The loan amount in dollars.
* @param {*} rate The loan rate in percent.
* @param {*} repayment The repayment amount in dollars.
* @param {number} [daysPerPayment=14]
* @return {int} Number of days for the loan period.
*/
function calculateLoanPeriod(amount, rate, repayment, daysPerPayment = 14) {
  const daysPerInterestCharge = 30;
  let d = 0;
  let remaining = amount;
  let interestForPeriod = 0;
  let totalInterest = 0;
  while (remaining > 0) {
    const dailyInterest = remaining * rate / 100 / 365;
    interestForPeriod += dailyInterest;
    if (d % daysPerPayment == 0) remaining -= repayment;
    if (d % daysPerInterestCharge == 0) {
      remaining += interestForPeriod;
      totalInterest += interestForPeriod;
      interestForPeriod = 0;
    }
    // Check for insufficient repayment, so we don't blow up.
    if (d > daysPerInterestCharge && d > daysPerPayment && remaining > amount) {
      return NaN;
    }
    d++;
  }
  return {'days': d, 'interest': Math.floor(totalInterest)};
}

window.onload = function() {
  const form = document.getElementById('calculator');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = form.elements['amount'].value;
    const rate = form.elements['rate'].value;
    const repayment = form.elements['repayment'].value;
    const cadence = form.elements['cadence'].value;
    let daysPerPayment = cadence == 'fortnightly' ? 14 : 30;
    const loanObject = calculateLoanPeriod(
        amount, rate, repayment, daysPerPayment = daysPerPayment);
    const loanPeriodInDays = loanObject.days;
    const totalInterest = loanObject.interest;
    if (loanPeriodInDays) {
      const loanPeriodInYears = Math.floor(loanPeriodInDays / 365);
      const extraMonths = Math.floor(loanPeriodInDays % 365 / 30);
      term = `${loanPeriodInYears} years and ${extraMonths} months.
      Total interest paid: $${totalInterest}`;
    } else {
      term = `The repayment is too small to pay off this loan!`;
    }
    document.getElementById('term').value = term;
  });
};
