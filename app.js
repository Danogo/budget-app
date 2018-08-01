// MODEL
const budgetModel = (function () {

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
    // Get data from input fields
    let input = budgetUI.getInput();
    console.log(input);
  };

  return {
    // Function to initialize whole application
    init: function() {
      console.log('Application has started');
      setupEventListeners();
    }
  };

})(budgetModel, budgetView);

budgetController.init();