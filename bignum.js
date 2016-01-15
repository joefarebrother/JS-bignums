var Bignum = (function(){ //immediately involked
	var MAX_INT = 1<<62;

	function Bignum(sign, digits){
		this.sign = sign;
		this.digits = digits;
	}

	function createFromNumber(num){
		if(!num){
			return Bignum(0, []);
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

	return create; 
})()