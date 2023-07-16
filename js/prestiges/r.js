function rocketFuelPower() {
  let power = player.r.fuel.add(1).log10().add(1).sqrt()
  
	if (player.r.upgrades.includes(33)) power = power.pow(LAYER_UPGS.r[33].currently().add(1));
	if (player.c.upgrades.includes(12)) power = power.pow(LAYER_UPGS.c[12].currently().add(1));
	if (player.o.upgrades.includes(12)) power = power.pow(LAYER_UPGS.o[12].currently().add(1));
  if (player.w.unl) power = power.pow(getAcuityStuff(3, "boost").add(1))
  
  return expoSoftcap(power, 4, 5).div(4).add(3/4);
}