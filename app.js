// MODEL
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
  // Data about budget
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      let newItem, ID;
      // create new ID, which is equal to lastID + 1
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // create new item based on 'inc' or 'exp' type
      if (type = 'inc') {
        newItem = new Income(ID, des, val);
      } else if(type = 'exp') {
        newItem = new Expense(ID, des, val)
      }
      // add new created item to array
      data.allItems[type].push(newItem);
      // return new created item so it can be used outside model
      return newItem;
    }
  }

})();

// VIEW
const budgetView = (function () {
  // Strings for DOM selectors
  const DOMselectors = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    expensesList: '.expenses__list',
    incomeList: '.income__list'
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
    addListItem: function(obj, type) {
      // Create html string for item div
      let html, htmlEl, selector;
      if (type === 'inc') {
        selector = DOMselectors.incomeList;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if(type === 'exp') {
        selector = DOMselectors.expensesList;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      // insert data from obj to item html string
      htmlEl = html.replace('%id%', obj.id);
      htmlEl = htmlEl.replace('%description%', obj.description);
      htmlEl = htmlEl.replace('%value%', obj.value);
      // Insert prepared html element into DOM
      document.querySelector(selector).insertAdjacentHTML('beforeend', htmlEl);
    },
    clearFields: function() {
      let fields = document.querySelectorAll(`${DOMselectors.inputDescription}, ${DOMselectors.inputValue}`);
      Array.prototype.forEach.call(fields, function(input) {
        input.value = '';
      });
      fields[0].focus();
    }
  };
})();

// APP CONTROLLER
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
  };
  // Adding new item
  const ctrlAddItem = function () {
    let input, newItem
    // Get data from input fields
    input = budgetUI.getInput();
    if (input.description !== '' && !isNaN(input.value) && input.value !== 0) {
      // Add new item to data structure in model
      newItem = budgetModel.addItem(input.type, input.description, input.value);
      // Add item to UI
      budgetUI.addListItem(newItem, input.type);
      // Clear input fields
      budgetUI.clearFields();
      // Calculate and update budget
      updateBudget();
    }
  };

  const updateBudget = function () {

  }

  return {
    // Function to initialize whole application
    init: function () {
      console.log('Application has started');
      setupEventListeners();
    }
  };

})(budgetModel, budgetView);

budgetController.init();