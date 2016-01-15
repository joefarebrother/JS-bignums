var Bignum = (function(){ //immediately involked
	var MAX_INT = 1<<62;

	function Bignum(sign, digits){
		this.sign = sign;
		this.digits = digits;
	}

	function createFromNum(num){
		if(!num){
			return Bignum(0, []);
		}

		var sign;
		if(num < 0){
			sign = -1;
			num = -num;
		}
		else{sign = 1;}

		digits = [];
		while(num !== 0){
			digits.shift(num % MAX_INT);
			num = Math.floor(num / MAX_INT);
		}
		
		return new Bignum(sign, digits);
	}

	function createFromString(str){
		//idk how to implement this right now
		throw new Error("Creation from string not yet supported");
	}


	return createFromNum; //Temporary, will later make a function to decide between createFromNum and createFromString
})()