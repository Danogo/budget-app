// MODEL
const budgetData = (function() {

})();

// VIEW
const budgetUI = (function() {

});

// APP CONTROLLER
const budgetController = (function(budgetModel, budgetView) {

  // Adding new item
  function ctrlAddItem() { 
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.querySelector('.add__description').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(budgetData, budgetUI);