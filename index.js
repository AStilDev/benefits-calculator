/*jshint esversion: 6 */

/**
 * Represents an employee
 * name: Employee name
 * yearlySalary: Employee salary
 * dependents: Employee's spouse and/or/children
 */
class Employee {
    constructor(name, yearlySalary, dependents) {
        this.name = name;
        this.yearlySalary = yearlySalary;
        this.dependents = dependents;
    }
}

/**
 * A calculator that can calculate an employee's
 * salary after the cost of benefits is applied.
 * employee: The employee whose salary will be caluclated
 * baseBenefitAmount: Initial cost of benefits for an employee
 * dependentBenefitAmount: Cost of benefits for each dependent
 * discount: Percentage to be applied to a benefit amount based on criteria
 * discountCriteria: Determines when to apply a discount
 */
class Calculator {    
    constructor(
        employee,
        baseBenefitAmount,
        dependentBenefitAmount,
        discount,
        discountCriteria) {
            this.employee = employee;
            this.baseBenefitAmount = baseBenefitAmount;
            this.dependentBenefitAmount = dependentBenefitAmount;
            this.discount = discount;
            this.discountCriteria = discountCriteria;
        }

    // Determines employee's new salary based on benefits
    calculate() {
        let self = this;

        // apply discount to employee
        let totalBenefitsArray = [];
        totalBenefitsArray.push(applyDiscount(
            self.employee.name, 
            self.baseBenefitAmount));

        // apply discount to dependents
        for (let dependent of self.employee.dependents){
            totalBenefitsArray.push(applyDiscount(
                dependent,
                self.dependentBenefitAmount));
        }

        // Applies the discount to benefit cost based on criteria
        function applyDiscount(name, baseBenefit) {
            let totalBenefit = baseBenefit;
            if (name !== undefined && name.toUpperCase().startsWith(self.discountCriteria)){
                totalBenefit = baseBenefit - (baseBenefit * self.discount);
            }
            return totalBenefit;
        }

        // total the cost of benefits
        let totalBenefits = totalBenefitsArray.reduce((a,b) => a + b, 0);    
        return self.employee.yearlySalary - totalBenefits;
    }
}

/**
 * Adds a new dependent input text field to the window.
*/
var addDependent = (function() {
    let counter = 1;
    const limit = 20;

    return function() {
        if (counter == limit) {
            alert("Cannot add anymore dependents.");
        }
        else {
            let dependentsDiv = document.getElementById('dependentNames');
            let newInput = document.createElement('input');
            let newBr = document.createElement('br');
            newInput.onblur = function() { buildCalculator('dependentName'); };
            newInput.type = 'text';
            dependentsDiv.appendChild(newInput);
            dependentsDiv.appendChild(newBr);
            counter++;
        }
    };
})();

/**
 * Reconstructs the calculator when input changes.
 * inputType: Either an Employee or a Dependent type
*/
function buildCalculator(inputType){
    switch (inputType)
    {
        case 'employeeName':
            // grab employee name input
            calculator.employee.name = employeeInput.value;
            payAfterBenefits = calculator.calculate();
            updateTotal();
            break;
        case 'dependentName':
            // grab dependent name input(s)
            calculator.employee.dependents = [];
            for (let dependent of dependentInput){
                if (dependent.value !== undefined && dependent.value !== ''){
                    calculator.employee.dependents.push(
                        dependent.value);
                }
            }
            payAfterBenefits = calculator.calculate();
            updateTotal();
            break;
        default:
            return;
    }
}

/**
 * Updates the total salary after benefits on the window.
*/
function updateTotal(){
    document.getElementById('totalSalary').value = "$" + payAfterBenefits.toLocaleString('en');
}

// ---End definitions--- //

const dependentInput = document.getElementById('dependentNames').children;
const employeeInput = document.getElementById('employeeName');

const paychecksInAYear = 26;
const amountPerPaycheck = 2000;
const baseBenefitAmount = 1000;
const dependentBenefitAmount = 500;
const discount = 0.10;
const discountCriteria = 'A';
let payAfterBenefits = paychecksInAYear * amountPerPaycheck;

// defaults
let calculator = new Calculator(
    new Employee(
        '',
        paychecksInAYear * amountPerPaycheck,
        []),
    baseBenefitAmount,
    dependentBenefitAmount,
    discount,
    discountCriteria
);

// add dependent button
document.getElementById("addDependent").addEventListener('click', () => {
    addDependent();
});

// initial calculation
payAfterBenefits = calculator.calculate();
updateTotal();