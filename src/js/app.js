var petTemplate = $('#petTemplate');
var temp_json_idx = 0;
var cnt = 0;

App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
   // 약 정보 JSON에서 불러옴
   $.getJSON('../mdcs.json', function(data) {
     var medRow = $('#medRow');
     var medTemplate = $('#med_list');

     for (i = 0; i < data.length; i ++) {
       medTemplate.find('.med_title').text(data[i].name);
       medTemplate.find('img').attr('src', data[i].picture);
       medTemplate.find('.med_buy_btn').attr('data-id', data[i].id);
       medTemplate.find('.med_info_btn').attr('data-id', data[i].id);
       medTemplate.find('.med_price').text(data[i].cost);
       medTemplate.find('.med_info').text(data[i].efc1);

       medRow.append(medTemplate.html());
     }
   });
   // 공공 데이터 포털에서 추가한 약 정보 JSON에서 불러옴
   $.getJSON('../med_info_public_data.json', function(data) {
    var medListRow = $('.medListRow');
    var medList = $('.medList');

    for (i = 0; i < data.length; i ++) {
      medList.find('.med_list_name').text(data[i].MEDICINE_NAME);
      medList.find('.med_list_info').text(data[i].MEDICINE_INFO);
      medList.find('.med_list_price').text(data[i].cost);
      medList.find('.med_list_buy_btn').attr('data-id', data[i].id);
      medListRow.append(medList.html());
    }
  });
   return await App.initWeb3();
 },

  initWeb3: async function() {
    if (window.ethereum) { 
      App.web3Provider = window.ethereum; 
      try { 
      // Request account access 
      await window.ethereum.enable(); 
      } catch (error) { 
      // User denied account access... 
      console.error("User denied account access") 
      } 
      } 
      // Legacy dapp browsers... 
      else if (window.web3) { 
           App.web3Provider = window.web3.currentProvider; 
      } 
      // If no injected web3 instance is detected, fall back to Ganache 
      else { 
           App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545"); 
      } 
      web3 = new Web3(App.web3Provider); 
      

    return App.initContract();
  },

  // migrate한 파일들을 동기화하여 계약에 대한 정보를 수동 입력하지 않아도 된다.
  initContract: function() {
    $.getJSON('Adoption.json', function(data) { 

      var AdoptionArtifact = data; 
      App.contracts.Adoption = TruffleContract(AdoptionArtifact); 
      App.contracts.Adoption.setProvider(App.web3Provider); 
      
      $.getJSON('SimpleBank.json', function(data1) { 
        
        var SimpleBankArtifact = data1; 
        App.contracts.SimpleBank = TruffleContract(SimpleBankArtifact); 
        App.contracts.SimpleBank.setProvider(App.web3Provider); 

        // UserAddress 파일 추가
        $.getJSON('UserAddress.json', function(data2) { 
        
          var UserAddressArtifact = data2; 
          App.contracts.UserAddress = TruffleContract(UserAddressArtifact); 
          App.contracts.UserAddress.setProvider(App.web3Provider); 
          return App.markAdopted(); 
    
        });
  
      });

    }); 

    return App.bindEvents();
  },

  bindEvents: function() {
     // 구매 버튼 클릭
    $(document).on('click', '.med_buy_btn', App.handleAdopt);
    // 성분 버튼 클릭
    $(document).on('click', '.med_info_btn', App.medInfomation);
    // 리스트에 있는 약 구매 버튼 클릭
    $(document).on('click', '.med_list_buy_btn', App.handleAdoptList);
  },

  // 결제시 어떤 동작 실행
  markAdopted: function() {
    var adoptionInstance; 
    var cnt = 0;
    App.contracts.Adoption.deployed().then(function(instance) { 
       adoptionInstance = instance; 
       return adoptionInstance.getAdopters.call(); 
    }).then(function(adopters) { 
       for (i = 0; i < adopters.length; i++) { 
          if (adopters[i] !== '0x0000000000000000000000000000000000000000') { 
             cnt++;
          }
       }  
    }).catch(function(err) { 
       console.log(err.message); 
    }); 
  },

  // 약 성분
  medInfomation: function(event){
    event.preventDefault();

    var mId = parseInt($(event.target).data('id'));

    $.getJSON('../mdcs.json', function(data){
      for(var i=0; i<data.length; i++){
        if(i == mId){
          alert(data[mId].efc);
        }
      }          
      return;
     });
   },

   // 구매 버튼 눌렀을 때 
  handleAdopt: function(event) {
    event.preventDefault();

    var mId = parseInt($(event.target).data('id'));

    var adoptionInstance; 
    web3.eth.getAccounts(function(error, accounts) { 
       if (error) { console.log(error); } 
       var account = accounts[0]; 

       alert("주소를 입력해주세요");
       newWin = window.open("/adress.html", "myWin", "left=300,top=300,width=800,height=300");
    
       App.contracts.Adoption.deployed().then(function(instance) { 
          adoptionInstance = instance; 
          
          // Execute adopt as a transaction by sending account 
          var price = $('.med_price').eq(mId).text();
          var med_cnt_tmp = $('.med_cnt').eq(mId).val();
          var med_cnt = parseInt(med_cnt_tmp);
          var med_cnt_price = price*med_cnt;
          var amount = parseFloat(med_cnt_price)*Math.pow(10,18);
          
          // 배송 정보 처리 
          App.getUserAddress();
          
          return adoptionInstance.adopt(mId, {value:`${amount}`, from:account, to:adoptionInstance.address});
     
       }).then(function(result) { 
          return App.markAdopted(); 
       }).catch(function(err) { 
          console.log(err.message); 
       }); 
    }); 
  },


  // 리스트에 있는 약 구매 버튼 클릭 시
  handleAdoptList: function(event) {
    event.preventDefault();

    var mId = parseInt($(event.target).data('id'));

    var adoptionInstance; 
    web3.eth.getAccounts(function(error, accounts) { 
       if (error) { console.log(error); } 
       var account = accounts[0]; 

       App.getUserAddress();
       alert("주소를 입력해주세요");
       
       newWin = window.open("/adress.html", "myWin", "left=300,top=300,width=800,height=300");
    
       App.contracts.Adoption.deployed().then(function(instance) { 
          adoptionInstance = instance; 
          
          var price = $('.med_list_price').eq(mId).text();
          var med_cnt_tmp = $('.med_list_cnt').eq(mId).val();
          var med_cnt = parseInt(med_cnt_tmp);
          var med_cnt_price = price*med_cnt;
          var amount = parseFloat(med_cnt_price)*Math.pow(10,18);
          
          return adoptionInstance.adopt(mId, {value:`${amount}`, from:account, to:adoptionInstance.address});
     
       }).then(function(result) { 
          return App.markAdopted(); 
       }).catch(function(err) { 
          console.log(err.message); 
       }); 
    }); 
  },


  // 배송 정보 처리
  setUserAddress: function() {
    var adoptionInstance; 
    web3.eth.getAccounts(function(error, accounts) { 
       if (error) { console.log(error); } 
       var account = accounts[0]; 
    
       App.contracts.UserAddress.deployed().then(function(instance) { 
          adoptionInstance = instance; 
          
          var text = "Test123";
          adoptionInstance.setUserAddress(text, {from:account});
          return;
     
       }).then(function(result) { 
          App.getUserAddress(); 
       }).catch(function(err) { 
          console.log(err.message); 
       }); 
    }); 
  },

  // 배송 정보 처리
  getUserAddress: function() {
    var adoptionInstance; 
    web3.eth.getAccounts(function(error, accounts) { 
       if (error) { console.log(error); } 
       var account = accounts[0];     
       App.contracts.UserAddress.deployed().then(async function(instance) { 

          adoptionInstance = instance;         
          cnt++;
          // Solidity에서 가져오는 것이 느리기 때문에 비동기로 처리
          var text1 = await adoptionInstance.getDeliveryInfo();
          alert(text1);
          return;
     
       }).then(function(result) { 
       }).catch(function(err) { 
          console.log(err.message); 
       }); 
    }); 
  },


  handleDeposit: function(event) {

    var SimpleBankInstance; 
    web3.eth.getAccounts(function(error, accounts) { 
       if (error) { console.log(error); } 
       var account = accounts[0]; 
    
       App.contracts.SimpleBank.deployed().then(function(instance) { 
          SimpleBankInstance = instance; 
          
          amount = parseFloat($(".deposit_amount").val())*Math.pow(10,18);
          result = SimpleBankInstance.deposit({value:`${amount}`, from:account, to:SimpleBankInstance.address});
          return;
     
       }).catch(function(err) { 
          console.log(err.message); 
       }); 
    }); 
  },
  
  handleWithdraw: function(event) {
    var SimpleBankInstance; 
    web3.eth.getAccounts(function(error, accounts) { 
       if (error) { console.log(error); } 
       var account = accounts[0]; 
    
       App.contracts.SimpleBank.deployed().then(function(instance) { 
          SimpleBankInstance = instance; 
          
          amount = parseFloat($(".withdraw_amount").val())*Math.pow(10,18);
          // 이더 전송할 땐 value, 트랜잭션 만들 땐 필요 없음 (0번째에서: accoutns[0])
          // 어떤 계정에서 나갈지만 남김
          // amount를 .sol에 전달
          result = SimpleBankInstance.withdraw(amount, {from:account});
          return;
     
       }).catch(function(err) { 
          console.log(err.message); 
       }); 
    }); 
  },

  handleBalance: function(event) {
    var SimpleBankInstance; 
    web3.eth.getAccounts(function(error, accounts) { 
       if (error) { console.log(error); } 
       var account = accounts[0]; 
    
       // await 쓰기 위해 async로 함수 선언
       App.contracts.SimpleBank.deployed().then(async function(instance) { 
          SimpleBankInstance = instance; 
          
          // 느리기 때문에 일단 기다리고 다음 구문 실행 await
          amount = await SimpleBankInstance.balance();
          // 이더단위로 만들어줌 (소수점 표시)
          $("#balance_text").val(parseFloat(amount)/Math.pow(10, 18));
          return;
     
       }).catch(function(err) { 
          console.log(err.message); 
       }); 
    }); 
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
