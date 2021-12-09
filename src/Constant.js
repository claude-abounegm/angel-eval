import Evaluatable from "./Evaluatable";

class Constant extends Evaluatable {
  constructor(value) {
    super();

    this.value = value;

    // console.log(value);
  }

  evaluate(context) {
    return this.value;
  }
}

export default Constant;
