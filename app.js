// ===== MODEL =====
const budgetModel = (function () {
  // Function constructor for expenses
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  // Method to calculate percentage for each expense
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  // Metho to retrieve percentage for specific expense
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }
  // Function constructor for incomes
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Function to calculate total incom or expenses
  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (obj) {
      sum += obj.value;
    });
    data.totals[type] = sum;
  }
  // Data about budget
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function (type, des, val) {
      let newItem, ID;
      // create new ID, which is equal to lastID + 1
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // create new item based on 'inc' or 'exp' type
      if (type === 'inc') {
        newItem = new Income(ID, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, des, val)
      }
      // add new created item to array
      data.allItems[type].push(newItem);
      // return new created item so it can be used outside model
      console.log(data);
      return newItem;
    },
    deleteItem: function (type, id) {
      let ids, index;
      ids = data.allItems[type].map(function (obj) {
        return obj.id;
      });
      index = ids.indexOf(id);
      // if element with provided id exist in data
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
      console.log(data);
    },
    calculateBudget: function () {
      // Calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');
      // Calculate the budget = inc - exp
      data.budget = data.totals.inc - data.totals.exp;
      // Calculate the percantage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        // set to -1 if there is no income so percentage isn't defined
        data.percentage = -1;
      }
    }, 
    calculatePercentages: function () {
      data.allItems.exp.forEach(function(currExp){
        currExp.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      let allPercs = data.allItems.exp.map(function(currExp) {
        return currExp.getPercentage();
      });
      return allPercs;
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  }

})();

// ===== VIEW =====
const budgetView = (function () {
  // Strings for DOM selectors
  const DOMselectors = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    expensesList: '.expenses__list',
    incomeList: '.income__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expPercLabel: '.item__percentage',
    dateLabel: '.budget__title--date',
    addContainerLabel: '.add'
  };
  const formatNumber = function (num, type) {
    let spliNum, int, dec, sign;
    // get absolute value from num 
    num = Math.abs(num);
    // set number to have exactly 2 decimal points
    num = num.toFixed(2);
    // insert comma to seperate thousands
    // split on integer and decimal parts
    splitNum = num.split('.');
    int = splitNum[0];
    if (int.length > 3) {
      int = insertComma(int);
    }
    dec = splitNum[1];
    // insert appropriate sign
    sign = type === 'exp' ? '-' : '+';
    // return formatted number
    return sign + ' ' + int + '.' + dec;
  };
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const insertComma = function(num) {
    num = num.split('');
    let index = 0;
    for (let i = num.length - 1; i >= 0; i--) {
      index++;
      if (index % 3 === 0) {
        num.splice(i, 0, ',');
      }
    }
    return num.join('');
  };

  // Exposed public object
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMselectors.inputType).value,
        description: document.querySelector(DOMselectors.inputDescription).value,
        value: Math.abs(parseFloat(document.querySelector(DOMselectors.inputValue).value))
      }
    },
    getDOMselectors: function () {
      return DOMselectors;
    },
    addListItem: function (obj, type) {
      // Create html string for item div
      let html, htmlEl, selector;
      if (type === 'inc') {
        selector = DOMselectors.incomeList;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="ios-close-circle-outline"></ion-icon></button></div></div></div>'
      } else if (type === 'exp') {
        selector = DOMselectors.expensesList;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="ios-close-circle-outline"></ion-icon></button></div></div></div>'
      }
      // insert data from obj to item html string
      htmlEl = html.replace('%id%', obj.id);
      htmlEl = htmlEl.replace('%description%', obj.description);
      htmlEl = htmlEl.replace('%value%', formatNumber(obj.value, type));
      // Insert prepared html element into DOM
      document.querySelector(selector).insertAdjacentHTML('beforeend', htmlEl);
    },
    deleteListItem: function (itemID) {
      let el = document.getElementById(itemID);
      el.parentNode.removeChild(el);
    },
    clearFields: function () {
      let fields = document.querySelectorAll(`${DOMselectors.inputDescription}, ${DOMselectors.inputValue}`);
      Array.prototype.forEach.call(fields, function (input) {
        input.value = '';
      });
      fields[0].focus();
    },
    displayBudget(obj) {
      let type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMselectors.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMselectors.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMselectors.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMselectors.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMselectors.percentageLabel).textContent = '---';
      }
    },
    displayPercentages: function (percentages) {
      let fields = document.querySelectorAll(DOMselectors.expPercLabel);
      Array.prototype.forEach.call(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },
    displayDate: function () {
      let now, year, month;
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      monthName = monthNames[month];
      document.querySelector(DOMselectors.dateLabel).textContent = monthName + ' ' + year;
    },
    changedType: function () {
      document.querySelector(DOMselectors.addContainerLabel).classList.toggle('red');
    }
  };
})();

// ===== APP CONTROLLER =====
const budgetController = (function (budgetData, budgetUI) {
  // Setup event listeners
  const setupEventListeners = function () {
    // Strings for DOM selectors
    const DOMs = budgetUI.getDOMselectors();
    // Event handlers
    document.querySelector(DOMs.inputBtn).addEventListener('click', ctrlAddItem);
    document.querySelector(DOMs.inputValue).addEventListener('keypress', function (event) {
      if (event.key === 'Enter' || event.keyCode === 13) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOMs.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOMs.inputType).addEventListener('change', budgetUI.changedType);
  };
  // Adding new item
  const ctrlAddItem = function () {
    let input, newItem
    // 1. Get data from input fields
    input = budgetUI.getInput();
    if (input.description.replace(/\s/g, "").length && !isNaN(input.value) && input.value !== 0) {
      // 2. Add new item to data structure in model
      newItem = budgetData.addItem(input.type, input.description, input.value);
      // 3. Add item to UI
      budgetUI.addListItem(newItem, input.type);
      // 4. Clear input fields
      budgetUI.clearFields();
      // 5. Calculate and update budget
      updateBudget();
      // 6. Calculate and update percentages
      updatePercentages();
    }
  };
  // Deleting item
  const ctrlDeleteItem = function (event) {
    let target = event.target;
    // Selecting proper item using event delegation with fallback for firefox browser
    if (target.classList.contains('item__delete--btn') || target.parentNode.classList.contains('item__delete--btn')) {
      let itemID, splitID, type, ID;
      re = /exp-\d+|inc-\d+/ //matches inc-xx or exp-xx
      // searching for element with 'exp-xx' or 'inc-xx' id
      function findParentWithID(el) {
        while (!re.test(el.id)) {
          el = el.parentNode;
          if (el === document) {
            break;
          }
        }
        return el.id;
      }
      // Pull type and id from element which will be deleted
      itemID = findParentWithID(target);
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete item from data structure
      budgetData.deleteItem(type, ID);
      // 2. Delete item from the UI
      budgetUI.deleteListItem(itemID);
      // 3. Update new budget
      updateBudget();
      // 4. Calculate and update percentages if inc was deleted
      if (type = 'inc') {
        updatePercentages();
      }
    }
  };
  // Update budget
  const updateBudget = function () {
    // 1. Calculate the budget
    budgetData.calculateBudget();
    // 2. Get budget from Model
    let budgetObj = budgetData.getBudget();
    // 3. Display budget in the UI
    budgetUI.displayBudget(budgetObj);
  };
  // Update percentages
  const updatePercentages = function () {
    // 1. Calculate percentages
    budgetData.calculatePercentages();
    // 2. Get calculated percentages
    let percentages = budgetData.getPercentages();
    // 3. Display percentages in the UI
    budgetUI.displayPercentages(percentages);
  };
  return {
    // Function to initialize whole application
    init: function () {
      console.log('Application has started');
      setupEventListeners();
      budgetUI.displayDate();
    }
  };

})(budgetModel, budgetView);

budgetController.init();