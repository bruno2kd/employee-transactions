const { isDateFromLastYear } = require("../utils")

class AdpTestController {
    constructor() {
        this.index = this.index.bind(this);
        this.performCalculation = this.performCalculation.bind(this);
        this.adpBaseUrl = "https://interview.adpeai.com/api/v2"
        this.defaultTransactionType = 'alpha'
        this.responseMap = {
            200: "Success",
            400: "Incorrect value in result; no ID specified; value is invalid",
            404: "Value not found for specified ID",
            503: "Error communicating with database",
        }
    }

    async index(req, res) {
        try {
            const transactionType = req?.params?.type
            const response = await this.performCalculation(transactionType)
            res.setHeader("Content-Type", "application/json")
            res.statusCode = response.statusCode
            res.end(JSON.stringify(response))    
        } catch (error) {
            console.log(error);
            res.status(400).end(JSON.stringify({
                message: "Something went wrong! =\ "
            }))
        }
        
    }

    async performCalculation(transactionType = this.defaultTransactionType) {
        try {
            const transactionRes = await fetch(`${this.adpBaseUrl}/get-task`)
            const transactionsData = await transactionRes.json()
            const transactions = transactionsData?.transactions

            const initialValue = {
                employees: {},
                topEarner: null
            }

            const employeeMaping = transactions.reduce((acc, tr) => {
                const { timeStamp } = tr
                // check if it is last year
                const isLastYear = isDateFromLastYear(timeStamp)
                if (!isLastYear) return acc

                const curEmployee = tr.employee
                const employeeId = curEmployee?.id
                const transactionAmount = tr.amount || 0
                const employeesAcc = acc.employees
                let employee = employeesAcc[employeeId]


                // if new employee add to the map, if it already there, add amount to total
                if (employee) {
                    const newAmount = employee.amount + transactionAmount
                    if (tr.type === transactionType) {
                        employee.result.push(tr.transactionID)
                    }
                    employee.amount = newAmount
                    employeesAcc[employeeId] = employee
                } else {
                    if (tr.type === transactionType) {
                        employee = {
                            amount: transactionAmount,
                            result: [tr.transactionID]
                        }
                    } else {
                        employee = {
                            amount: transactionAmount,
                            result: []
                        }
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
            const submitRes = await fetch(`${this.adpBaseUrl}/submit-task`, requestOptions)
            const statusCode = submitRes.status
            return {
                success: statusCode === 200,
                statusCode: statusCode,
                message: this.responseMap[statusCode],
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
