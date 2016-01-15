var Bignum = (function(){ //immediately involked
	var MAX_INT = Math.pow(2, 52); 

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

	Bignum.prototype.toNumber = function() {
		var num = 0;
		for (var i = 0; i < this.digits.length; i++) {
			num = num * MAX_INT + this.digits[i];
		};
		return num * this.sign;
	};

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
		return this.add(create(b).negate());
	};

	function addDigits (a, b) {
		var digits = [], carry = 0;
		for(var i = 1; i <= a.length || i <= b.length; i++){
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

	Bignum.prototype.multiply = function(b){
		var a = this;
		b = create(b);
		if(a.sign === 0 || b.sign === 0){
			return create(0);
		}
		else{
			return new Bignum(a.sign * b.sign, multiplyDigits(a.digits, b.digits));
		}
	}

	function multiplyDigits(a, b){
		var result = [];
		for (var i = 0; i < a.length; i++) {
			result = addDigits(result, multiplyOneByManyDigits(a[i], b, a.length - i - 1));
		};
		return result;
	}
	function multiplyOneByManyDigits(a1, b, trailingZeroes){
		var carry = 0, digits = [];

		for (var i = b.length - 1; i >= 0; i--) {
			var next = a1 * b[i] + carry;
			carry = Math.floor(next / MAX_INT);
			next = next % MAX_INT;
			digits.unshift(next);
		};

		if(carry > 0){
			digits.unshift(carry);
		}
		for (var i = 0; i < trailingZeroes; i++) {
			digits.push(0);
		};
		return digits;
	}


	//From main function
	return create; 
})()