
var db, objectStore, customerObjectStore;

const testData = [
  { myKey: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { myKey: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

// Open database (creates on first time through)
var request = window.indexedDB.open("MyTestDatabase");

console.log('request should hold an "IDBOpenDBRequest": ' + request);

request.onerror = function(event) {
  console.log ("onerror() fired: " + event.target.errorCode);
};

request.onsuccess = function(event) {
  console.log ("onsuccess() fired: " + event.target.result);

  db = event.target.result;
};

// Below event will be triggered when:
// i) You create a new DB, or
// ii) You create a DB with a higher version number than existed previously.
request.onupgradeneeded = function(event) {

  console.log ("onupgradeneeded() fired: " + event.target.result);

  db = event.target.result;

  // Add any newly required objectStores
  objectStore = db.createObjectStore("customers", { keyPath: "myKey"} );

  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("email", "email", { unique: true });

}

populateData = function() {

  var transaction = db.transaction(["customers"], "readwrite");

  transaction.oncomplete = function(event) {
    console.log("Transaction complete: " + event.target.result);
  };
  transaction.onerror = function(event) {
    console.log("DB error: " + event.target.result);
  };

  objectStore = transaction.objectStore("customers");
  testData.forEach (function(customer) {
    var request = objectStore.add(customer);
    request.onsuccess = function(event) {
      console.log("Data added to DB: " + event.target.result)
    };
  });
}
