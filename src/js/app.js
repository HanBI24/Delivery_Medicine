var petTemplate = $('#petTemplate');
var temp_json_idx = 0;

App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
   // Load pets.
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

  initContract: function() {
    $.getJSON('Adoption.json', function(data) { 

      var AdoptionArtifact = data; 
      App.contracts.Adoption = TruffleContract(AdoptionArtifact); 
      App.contracts.Adoption.setProvider(App.web3Provider); 
      
      $.getJSON('SimpleBank.json', function(data1) { 
        
        var SimpleBankArtifact = data1; 
        App.contracts.SimpleBank = TruffleContract(SimpleBankArtifact); 
        App.contracts.SimpleBank.setProvider(App.web3Provider); 
        return App.markAdopted(); 
  
      });

    }); 

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.med_buy_btn', App.handleAdopt);
    $(document).on('click', '.med_info_btn', App.medInfomation);
    $(document).on('click', '.med_list_buy_btn', App.handleAdoptList);

    // $(document).on('click', '#deposit_btn', App.handleDeposit);
    // $(document).on('click', '#withdraw_btn', App.handleWithdraw);
    // $(document).on('click', '#balance_btn', App.handleBalance);
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
             //$('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true); 
             //상태 변경 필요 없으므로 제거
             cnt++;
            //  App.setDelivery(cnt);
          }
       }  
      //  $('.collect_product').find('text').text('Success')
      //  $('.start_delivery').find('text').text('Success')
      //  $('.complet_delivery').find('text').text('Success')
    }).catch(function(err) { 
       console.log(err.message); 
    }); 
  },

  setDelivery: function(cnt){
   $.getJSON('../delivery.json', function(data){
      var delRow = $('#delRow');
      var delTemplete = $("#delTemplete");
      for(i=temp_json_idx; i< data.length; i++){
         // delTemplete.find('.collect_product').text(data[i].collect);
         // delTemplete.find('.start_delivery').text(data[i].start);
         // delTemplete.find('.complet_delivery').text(data[i].complete);
         
         delTemplete.append(data[i].collect +"<br></br>");
         delTemplete.append(data[i].start+"<br></br>");
         delTemplete.append(data[i].complete+"<br></br>");
         delTemplete.append("---------------------------------------------------------" +"<br></br>");
         temp_json_idx++;
         return;
      }
    });
  },

  medInfomation: function(event){
    event.preventDefault();

    var mId = parseInt($(event.target).data('id'));

    $.getJSON('../mdcs.json', function(data){
      for(var i=0; i<data.length; i++){
        if(i == mId){
          alert(data[mId].efc);
        }
      }          
          // delTemplete.append(data[i].collect +"<br></br>");

          return;

     });
   },

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
          // 결제창
          App.setDelivery();
          
          return adoptionInstance.adopt(mId, {value:`${amount}`, from:account, to:adoptionInstance.address});
     
       }).then(function(result) { 
          return App.markAdopted(); 
       }).catch(function(err) { 
          console.log(err.message); 
       }); 
    }); 
  },

  handleAdoptList: function(event) {
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
          var price = $('.med_list_price').eq(mId).text();
          var med_cnt_tmp = $('.med_list_cnt').eq(mId).val();
          var med_cnt = parseInt(med_cnt_tmp);
          var med_cnt_price = price*med_cnt;
          var amount = parseFloat(med_cnt_price)*Math.pow(10,18);
          // 결제창
          App.setDelivery();
          
          return adoptionInstance.adopt(mId, {value:`${amount}`, from:account, to:adoptionInstance.address});
     
       }).then(function(result) { 
          return App.markAdopted(); 
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
