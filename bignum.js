var Bignum = (function(){ //immediately involked
	var MAX_INT = 1<<62;

	function Bignum(sign, digits){
		this.sign = sign;
		this.digits = digits;
	}

	function createFromNumber(num){
		if(!num){
			return new Bignum(0, []);
		}

		var sign;
		if(num < 0){
			sign = -1;
			num = -num;
		}
		else{sign = 1;}

		var digits = [];
		while(num !== 0){
			digits.unshift(num % MAX_INT);
			num = Math.floor(num / MAX_INT);
		}
		
		return new Bignum(sign, digits);
	}

	function createFromString(str){
		//idk how to implement this right now
		throw new Error("Bignum creation from string not yet supported");
	}

	function create(from){
		if(typeof from === "object"){return from;}
		if(typeof from === "number"){return createFromNumber(from);}
		if(typeof from === "string"){return createFromString(from);}
		throw new Error("Unrecognised type for Bignum creation");
	}

	Bignum.prototype.compare = function(b){ //returns 0 if a==b, +ve if a>b, -ve if a<b
		var a = this;
		b = create(b);
		if(a.sign != b.sign){return a.sign - b.sign;}
		return compareDigits(a.digits, b.digits)
	};

	function compareDigits(a, b){
		if(a.length != b.length){return a.sign - b.sign;}
		for (var i = 0; i < a.length; i++) {
			if(a[i] != b[i]){return a[i] - b[i];}
		};
		return 0;
	}
	
	Bignum.prototype.greaterThan        = function(b){return this.compare(b) > 0;};
	Bignum.prototype.lessThan           = function(b){return this.compare(b) < 0;};
	Bignum.prototype.equals             = function(b){return this.compare(b) == 0;};
	Bignum.prototype.greaterThanOrEqual = function(b){return this.compare(b) >= 0;};
	Bignum.prototype.lessThanOrEqual    = function(b){return this.compare(b) <= 0;};

	Bignum.prototype.add = function(b){
		var a = this;
		b = create(b);
		if(a.sign == b.sign){
			var digits = addDigits(a.digits, b.digits);
			return new Bignum(a.sign, digits);
		}

		var comp = compareDigits(a.digits, b.digits);

		if(comp == 0){return create(0);}
		if(comp < 0){
			var temp = a; 
			a=b; 
			b=temp;
		}

		// Now a will always have a larger absolute value than b, and a different sign
		// If a > 0, a-|b| will be > 0 If a < 0, -|a|+b = -(a-|b|) < 0
		// So the sign of the result will be the sign of a

		var digits = subtractDigits(a.digits, b.digits);
		return new Bignum(a.sign, digits);
	};

	Bignum.prototype.negate = function(){
		return new Bignum(-this.sign, this.digits);
	};
	Bignum.prototype.subtract = function (b) {
		return this.add(b.negate());
	};

	function addDigits (a, b) {
		var digits = [], carry = 0;
		for(var i = 1; i <= a.length && i <= b.length; i++){
			var nexta = (i > a.length) ? 0 : a[a.length - i],
			    nextb = (i > b.length) ? 0 : b[b.length - i],
			    next = nexta + nextb + carry;
			carry = Math.floor(next / MAX_INT);
			next = next % MAX_INT;
			digits.unshift(next);
		}
		if(carry){
			digits.unshift(carry);
		}

		return digits;
	}

	function subtractDigits(a, b){ //slightly simpler as a is gauranteed to be longer than b
		var digits = [], borrow = 0;
		for(var i = 1; i <= a.length && i; i++){
			var nexta = a[a.length - i],
			    nextb = (i > b.length) ? 0 : b[b.length - i],
			    next = nexta - nextb - borrow;
			if(next < 0){
				next = next + MAX_INT;
				borrow = 1;
			}
			else {borrow = 0;}
			digits.unshift(next);
		}

		while(digits[0] === 0){
			digits.shift();
		}
		return digits;
	}	


	//From main function
	return create; 
})()