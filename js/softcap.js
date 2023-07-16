function expoSoftcap(number, power, reach) {
  number = new Decimal(number)
  power = new Decimal(power)
  reach = new Decimal(reach)
  if (number.lt(reach)) return number;
  if (number.gte(reach)) {
    return number.root(power).mul(reach.div(reach.root(power)))
  }
}

function logSoftcap(number, power, reach) {
  number = new Decimal(number)
  power = new Decimal(power)
  reach = new Decimal(reach)
  if (number.lt(reach)) return number;
  if (number.gte(reach)) {
    return number.log(power).mul(reach.div(reach.log(power)))
  }
}

function tetrSoftcap(number, power, reach) {
  number = new Decimal(number)
  power = new Decimal(power)
  reach = new Decimal(reach)
  if (number.lt(reach)) return number;
  if (number.gte(reach)) {
    return number.tetr(Decimal.div(1, power)).mul(reach.div(reach.log(Decimal.div(1, power))))
  }
}