// ===== MODEL =====
const budgetModel = (function () {
  // Function constructor for expenses
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Function constructor for incomes
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Function to calculate total incom or expenses
  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (income) {
      sum += income.value;
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
      return newItem;
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
        data.percentage = -1;
      }
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
    container: '.container'
  }
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
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        selector = DOMselectors.expensesList;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      // insert data from obj to item html string
      htmlEl = html.replace('%id%', obj.id);
      htmlEl = htmlEl.replace('%description%', obj.description);
      htmlEl = htmlEl.replace('%value%', obj.value);
      // Insert prepared html element into DOM
      document.querySelector(selector).insertAdjacentHTML('beforeend', htmlEl);
    },
    clearFields: function () {
      let fields = document.querySelectorAll(`${DOMselectors.inputDescription}, ${DOMselectors.inputValue}`);
      Array.prototype.forEach.call(fields, function (input) {
        input.value = '';
      });
      fields[0].focus();
    },
    displayBudget(obj) {
      document.querySelector(DOMselectors.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMselectors.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMselectors.expensesLabel).textContent = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMselectors.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMselectors.percentageLabel).textContent = '---';
      }
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
    }
  };
  // Deleting item
  const ctrlDeleteItem = function (event) {
    let target = event.target;
    if (target.parentNode.tagName === 'BUTTON') {
      let itemID, splitID, type, ID;
      itemId = target.parentNode.parentNode.parentNode.parentNode.id;
      splitID = itemId.split('-');
      type = splitID[0];
      ID = splitID[1];
      // 1. Delete item from data structure

      // 2. Delete item from the UI

      // 3. Update new budget
    }
  }
  // Update budget
  const updateBudget = function () {
    // 1. Calculate the budget
    budgetData.calculateBudget();
    // 2. Get budget from Model
    let budgetObj = budgetData.getBudget();
    // 3. Display budget in the UI
    budgetUI.displayBudget(budgetObj);
  };

  return {
    // Function to initialize whole application
    init: function () {
      console.log('Application has started');
      budgetUI.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };

})(budgetModel, budgetView);

budgetController.init();