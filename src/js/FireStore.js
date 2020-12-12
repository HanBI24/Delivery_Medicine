$(function(){
    $(".finish_button").click(function(){

  var firebaseConfig = {
    apiKey: "AIzaSyBpkeHthpTxPgv9VTgpj60iubinssKYkFk",
    authDomain: "delivery-medicine.firebaseapp.com",
    projectId: "delivery-medicine",
    storageBucket: "delivery-medicine.appspot.com",
    messagingSenderId: "224510722855",
    appId: "1:224510722855:web:a669764f28ea316f455f02",
    measurementId: "G-2G0ZW7YHWG"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  
  var name = $('#input_name').val();
  var number = $('#input_num').val();
  var address_road = $('#input_address_road').val();
  var address_detail = $('#input_address_detail').val();

  var db = firebase.firestore();
  db.collection("주문정보").add({
    Name: name,
    CallNumber: number,
    AddressRoad: address_road,
    AddressDetail: address_detail
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
  alert("구매 완료");
  saveToFile_Chrome("구매 정보", name, number, address_road, address_detail);
})
    
});

function saveToFile_Chrome(fileName, name, call_number, address_road, address_detail) {
  var blob = new Blob(["| 이름: " +name, " | 전화번호: " +call_number, " | 주소: " +address_road, ", " +address_detail+ " |"], { type: 'text/plain' });
  objURL = window.URL.createObjectURL(blob);
          
  // 이전에 생성된 메모리 해제
  if (window.__Xr_objURL_forCreatingFile__) {
      window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
  }
  window.__Xr_objURL_forCreatingFile__ = objURL;
  var a = document.createElement('a');
  a.download = fileName;
  a.href = objURL;
  a.click();
}