
let db;

const request = indexedDB.open('pwaExpense', 1);

request.onupgradeneeded = function(event){
    const db = event.target.result;
    db.createObjectStore("new_expense", {
        autoIncrement: true
    });
};
request.onsuccess = function (event){
    db = event.target.result;
    if(navigator.onLine){
        uploadExpense();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
  };

  function saveData(data){
     const transaction = db.transaction(["new_expense"], "readwrite");
      const expenseObjectSave = transaction.objectStore('new_expense');
      expenseObjectSave.add(data);
  }
function uploadExpense(){
    const transaction = db.transaction(["new_expense"], "readwrite");
    const expenseObjectSave = transaction.objectStore('new_expense');
    const getAll = expenseObjectSave.getAll();

    getAll.onsuccess = function(){
        if (getAll.result.length > 0){
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json",
                },
              }).then((response) => response.json())
              .then((serverResponse) => {
                  if(serverResponse.message){
                      throw new Error(serverResponse);
                  }
                  const transaction = db.transaction(["new_expense"], "readwrite");
                  const expenseObjectSave = transaction.objectStore('new_expense');
                  expenseObjectSave.clear();
                  alert('all of the expenses have been submited');
              }).catch((err)=> console.log(err));
            

        }
    }
}
window.addEventListener("online", uploadExpenses);