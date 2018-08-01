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
    inputBtn: '.add__btn'
  }

  // Exposed public object
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMselectors.inputType).value,
        description: document.querySelector(DOMselectors.inputDescription).value,
        value: document.querySelector(DOMselectors.inputValue).value
      }
    },
    getDOMselectors: function () {
      return DOMselectors;
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
    document.querySelector(DOMs.inputDescription).addEventListener('keypress', function (event) {
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
    // Add new item to data structure in model
    newItem = budgetModel.addItem(input.type, input.description, input.value);
  };

  return {
    // Function to initialize whole application
    init: function () {
      console.log('Application has started');
      setupEventListeners();
    }
  };

})(budgetModel, budgetView);

budgetController.init();