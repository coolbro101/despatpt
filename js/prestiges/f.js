"use strict";

const FACTORY_COSTS = [1, 2, 13, 20, 37, 47, 54, 100, 142, 173].map(n => new Decimal(n));

function getThingMult() {
	let out;
	if (player.f.upgrades.includes(11)) out = player.f.things.add(1).pow(0.9);
	else out = player.f.things.add(1).log(1.1).add(1);
	if (player.f.upgrades.includes(15)) out = out.pow(1.5);
	return expoSoftcap(out, 100, "1e162");
}

function tickFactories(mult = 1) {
	const mul = new Decimal(mult).mul(100).mul(getFactoryMultiplier());
	for (const fac in player.f.factories) {
		if (player.f.factories[fac].gt(0)) {
      if (fac === "0") {
	  		player.f.things = player.f.things.add(
	  			player.f.factories[fac].mul(mul)
	  		);
  		} else {
  			player.f.factories[fac - 1] = player.f.factories[fac - 1].add(
			  	player.f.factories[fac].mul(mul)
		  	);
  		}
    }
	}
}

function getFactoryMultiplier() {
	let mult = new Decimal(1);
	if (player.f.upgrades.includes(13)) mult = mult.mul(LAYER_UPGS.f[13].currently());
	if (player.f.upgrades.includes(14)) mult = mult.mul(LAYER_UPGS.f[14].currently());
	if (player.r.upgrades.includes(23)) mult = mult.mul(LAYER_UPGS.r[23].currently());
	return mult.max(1);
}

function getFactoryCost(id) {
  let cost = FACTORY_COSTS[id]
  if (player.f.upgrades.includes(22)) cost = cost.div(LAYER_UPGS.f[22].currently())
  return cost;
}

function buyFactory(id) {
	if (player.f.factories[id].gt(0)) return;
	if (player.f.points.lt(getFactoryCost(id))) return;
	player.f.points = player.f.points.sub(getFactoryCost(id));
	player.f.factories[id] = new Decimal(1);
}