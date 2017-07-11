
var Promise = require("promise");

var p1 = new Promise(function(resolve, reject) { 

    setTimeout(function(){ 
         var o = Math.random();	
    	 if ( o <= 0.5) {
			return resolve(o);
		 } else {
			return reject("1 ponad 0.5"); 			

		};
           console.log(" koniec !!!!");		// to sie juz nie wykona ze wzgledu na return
	}, 2000);
	
   
   

});


var p2 = new Promise(function(resolve, reject) { 

    setTimeout(function(){ 
         var o = Math.random()	
    	 if (o <= 0.5) {
			return resolve(o);
		 } else {
			return reject("2 ponad 0.5"); 			

		};
           console.log(" koniec !!!!");		// to sie juz nie wykona ze wzgledu na return
	}, 1000);
	
   
   

});



Promise.all([p1, p2]).then(function(ans1){

		var p3 = new Promise(function(resolve, reject) { 

			setTimeout(function(){ 
				 resolve(100);
			}, 5000);
			
		   
		  
		});

     Promise.all([p3]).then(function(ans){
    	console.log("OK: ",ans, ans1);	 
	 });	
	
}).catch(function(ans){
	console.log("BAD: ",ans);
});


console.log("Dalsza czesc skryptu ....");