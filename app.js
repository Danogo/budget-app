// MODEL
const budgetModel = (function() {

})();

// VIEW
const budgetView = (function() {

  // Strings for DOM selectors
  const DOMselectors = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  // exposed public object
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMselectors.inputType).value,
        description: document.querySelector(DOMselectors.inputDescription).value,
        value: document.querySelector(DOMselectors.inputValue).value
      }
    },
    getDOMselectors: function() {
      return DOMselectors;
    }
  }
})();

// APP CONTROLLER
const budgetController = (function(budgetData, budgetUI) {
  // Strings for DOM selectors
  const DOMs = budgetUI.getDOMselectors();

  // Adding new item
  function ctrlAddItem() { 
    // get data from input fields
    let input = budgetUI.getInput();
    console.log(input);
  }

  document.querySelector(DOMs.inputBtn).addEventListener('click', ctrlAddItem);

  document.querySelector(DOMs.inputDescription).addEventListener('keypress', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(budgetModel, budgetView);