const { isDateFromLastYear } = require("../utils")

const ADP_BASE_URL = "https://interview.adpeai.com/api/v2"
const responseMap = {
    200: "Success",
    400: "Incorrect value in result; no ID specified; value is invalid",
    404: "Value not found for specified ID",
    503: "Error communicating with database",
}

class AdpTestController {
    constructor() {
        this.index = this.index.bind(this);
        this.performCalculation = this.performCalculation.bind(this);
    }
    
    async index(req, res) {
        const response = await this.performCalculation()
        res.setHeader("Content-Type", "application/json")
        res.statusCode = response.statusCode
        res.end(JSON.stringify(response))
    }

    async performCalculation() {
        try {
            const transactionRes = await fetch(`${ADP_BASE_URL}/get-task`)
            const transactionsData = await transactionRes.json()
            const transactions = transactionsData?.transactions

            const initialValue = {
                employees: {},
                topEarner: null
            }

            const employeeMaping = transactions.reduce((acc, tr) => {
                if (tr.type !== "alpha") return acc
                const { timeStamp } = tr
                const isLastYear = isDateFromLastYear(timeStamp)
                if (!isLastYear) return acc

                const curEmployee = tr.employee
                const employeeId = curEmployee?.id
                const transactionAmount = tr.amount || 0
                const employeesAcc = acc.employees
                let employee = employeesAcc[employeeId]


                if (employee) {
                    const newAmount = employee.amount + transactionAmount
                    employee.result.push(tr.transactionID)
                    employee.amount = newAmount
                    employeesAcc[employeeId] = employee
                } else {
                    employee = {
                        amount: transactionAmount,
                        result: [tr.transactionID]
                    }
                    employeesAcc[employeeId] = employee
                }

                // check if employee is top earner
                const topEarnerAmount = acc.topEarner?.amount || 0
                if (employee.amount > topEarnerAmount) {
                    acc.topEarner = {
                        employeeId: tr.employee.id,
                        amount: employee.amount,
                        employee: tr.employee,
                        result: employee.result
                    }
                }

                acc.employees = employeesAcc
                return acc
            }, initialValue)


            employeeMaping.topEarner.result
            const postData = {
                id: transactionsData.id,
                result: employeeMaping.topEarner.result
            }
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            };
            const submitRes = await fetch(`${ADP_BASE_URL}/submit-task`, requestOptions)
            const statusCode = submitRes.status
            return {
                success: statusCode === 200,
                statusCode: statusCode,
                message: responseMap[statusCode],
                topEarner: {
                    employee: employeeMaping.topEarner.employee,
                    amount: employeeMaping.topEarner.amount
                }
            }            
        } catch (error) {
            return {
                statusCode: 400,
                success: false,
                message: "Something went wrong! =\ "
            }
        }
    }
}

module.exports = AdpTestController;
