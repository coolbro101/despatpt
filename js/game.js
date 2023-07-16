"use strict";

let player;
const tmp = {},
	offTime = {
		remain: 0,
		speed: 1,
	};
let needCanvasUpdate = true;
let NaNalert = false;

function getStartPlayer() {
	return {
		tab: "tree",
		time: Date.now(),
		autosave: true,
		msDisplay: "always",
		offlineProd: true,
		versionType: "beta",
		version: 1.2,
		timePlayed: 0,
		hasNaN: false,
		points: new Decimal(10),
		p: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
		},
		k: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
			auto: false,
		},
		s: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
		},
		f: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			things: new Decimal(0),
			factories: [
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
			],
			upgrades: [],
		},
		b: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
		},
		r: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
      fuel: new Decimal(0),
			upgrades: [],
		},
		c: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
      power: new Decimal(0),
			upgrades: [],
		},
		o: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
		},
		w: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
      wisdom: new Decimal(0),
      acuity: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
		},
	};
}

const LAYERS = ["p", "k", "s", "f", "b", "r", "c", "o", "w"];

const LAYER_REQS = {
	p: new Decimal(10),
	k: new Decimal(100),
	s: new Decimal(1e12),
	f: new Decimal(1e135),
	b: new Decimal(42),
  r: new Decimal("1e1200"),
  c: new Decimal(3e7),
  o: new Decimal(3e7),
  w: new Decimal(355)
};

const LAYER_RES = {
	p: "prestige points",
	k: "knowledge",
	s: "skills",
	f: "factories",
	b: "books",
  r: "rockets",
  c: "chaos gems",
  o: "order power",
  w: "intelligence"
};

const LAYER_RES_CEIL = ["b", "w"];

const LAYER_TYPE = {
	p: "normal",
	k: "static",
	s: "normal",
	f: "static",
	b: "static",
  r: "static",
  c: "static",
  o: "static",
  w: "static"
};

// How requirements scale
const LAYER_EXP = {
	p: new Decimal(0.5),
	k: new Decimal(1.25),
	s: new Decimal(0.05),
	f: new Decimal(1.1),
	b: new Decimal(1.05),
  r: new Decimal(1.07),
  c: new Decimal(1.15),
  o: new Decimal(1.15),
  w: new Decimal(1.03)
};

const LAYER_BASE = {
	k: new Decimal(5),
	s: new Decimal(1.25),
	f: new Decimal(50),
	b: new Decimal(1.15),
  r: new Decimal(1e37),
  c: new Decimal(15),
  o: new Decimal(15),
  w: new Decimal(1.06)
};

const LAYER_ROW = {
	p: 0,
	k: 1,
	s: 1,
	b: 2,
	f: 2,
  r: 3,
  c: 4,
  o: 4,
  w: 4
};

const ROW_LAYERS = [["p"], ["k", "s"], ["b", "f"], ["r"], ["c", "w", "o"]];

const ORDER_UP = [[], ["k", "s"], ["f", "b"], ["r"], ["c", "w", "o"]];

const LAYER_EFFS = {
	// Where you put the effect of layers
	k: () =>
		getKnowledgeBase().pow(
			player.k.points.add(
				player.s.upgrades.includes(11)
					? LAYER_UPGS.s[11].currently()
					: 0
			)
		),
	s: () => expoSoftcap(player.s.points.add(1).log10(), 3, 13000),
	b: () => new Decimal(1.5).pow(player.b.points),
  r: () => new Decimal(1.03).pow(player.r.points.add(1).log10().mul(3).mul(rocketFuelPower())),
  c: () => new Decimal(2).pow(player.c.points.sub(1).add(
  player.c.upgrades.includes(21) ? LAYER_UPGS.c[21].currently() : 0
  )).sub(player.c.points.lt(1)?0.5:0),
  o: () => getOrderPower()
};

const TAB_REQS = {
	tree() {
		return true;
	},
	options() {
		return true;
	},
	info() {
		return true;
	},
	changelog() {
		return true;
	},
	credits() {
		return true;
	},
	p() {
		return (
			(player.p.unl || player.points.gte(tmp.layerReqs.p)) &&
			layerUnl("p")
		);
	},
	k() {
		return (
			(player.k.unl || player.points.gte(tmp.layerReqs.k)) &&
			layerUnl("k")
		);
	},
	s() {
		return (
			(player.s.unl || player.points.gte(tmp.layerReqs.s)) &&
			layerUnl("s")
		);
	},
	f() {
		return (
			(player.f.unl || player.points.gte(tmp.layerReqs.f)) &&
			layerUnl("f")
		);
	},
	b() {
		return (
			(player.b.unl || player.k.points.gte(tmp.layerReqs.b)) &&
			layerUnl("b")
		);
	},
	r() {
		return (
			(player.r.unl || player.points.gte(tmp.layerReqs.r)) &&
			layerUnl("r")
		);
	},
	c() {
		return (
			(player.c.unl || player.r.fuel.gte(tmp.layerReqs.c)) &&
			layerUnl("c")
		);
	},
	o() {
		return (
			(player.o.unl || player.r.fuel.gte(tmp.layerReqs.o)) &&
			layerUnl("o")
		);
	},
	w() {
		return (
			(player.w.unl || player.f.points.gte(tmp.layerReqs.w)) &&
			layerUnl("w")
		);
	},
};

const LAYER_AMT_NAMES = {
	// For "Next in x ___"
	p: "points",
	k: "points",
	s: "points",
	f: "points",
	b: "knowledge",
  r: "points",
  c: "rocket fuel",
  o: "rocket fuel",
  w: "factories"
};

function getLayerAmt(layer) {
	switch (layer) {
		// Example:
		// case "my_prestige_layer":
		//    return player.layer_that_has_currency_it_requires.points
		case "b":
			return player.k.points;
		case "c":
			return player.r.fuel;
		case "o":
			return player.r.fuel;
		case "w":
			return player.f.points;
		default:
			return player.points;
	}
}

function getLayerEffDesc(layer) {
	if (!Object.keys(LAYER_EFFS).includes(layer)) return "???";
	const eff = tmp.layerEffs[layer];
	switch (layer) {
		case "k":
			return `giving you a ${format(
				eff
			)}x multiplier to prestige point production.`;
		case "s":
			return `adding ${format(eff)} to the knowledge base.`;
		case "b":
			return `multiplying the knowledge base by ${format(eff)}.`;
    case "r":
      return `raising prestige point, point and skill production to the power of ${format(eff)}.`;
    case "c":
      return `producing ${format(eff)} chaos power per second.`;
    case "o":
      return `dividing knowledge, factory, book, knowledge, and rocket costs by ${format(eff)}.`;
		default:
			return `Hey hey! If you see this anywhere, please report that ${layer} is broken`;
	}
}

function getKnowledgeBase() {
	let base = new Decimal(2);
	if (player.k.upgrades.includes(22)) base = base.add(1);
	if (player.r.upgrades.includes(11))
		base = base.add(LAYER_UPGS.r[11].currently());
	if (player.k.upgrades.includes(23))
		base = base.add(LAYER_UPGS.k[23].currently());
	if (player.s.unl) base = base.add(LAYER_EFFS.s());
	if (player.f.upgrades.includes(12))
		base = base.add(LAYER_UPGS.f[12].currently());
	if (player.b.unl) base = base.mul(LAYER_EFFS.b());
	if (player.r.upgrades.includes(31))
		base = base.mul(LAYER_UPGS.r[31].currently());
	return base;
}

function save() {
	localStorage.setItem("prestige-tree", btoa(JSON.stringify(player)));
}

function load() {
	const get = localStorage.getItem("prestige-tree");
	if (get === null || get === undefined) player = getStartPlayer();
	else player = JSON.parse(atob(get));
	player.tab = "tree";
	offTime.remain = (Date.now() - player.time) / 1000;
	if (!player.offlineProd) offTime.remain = 0;
	player.time = Date.now();
	checkForVars();
	convertToDecimal();
	versionCheck();
	updateTemp();
	updateTemp();
	loadVue();
}

function exportSave() {
	const str = btoa(JSON.stringify(player));

	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}

function importSave(imported = undefined) {
	if (imported === undefined) imported = prompt("Paste your save here");
	try {
		player = JSON.parse(atob(imported));
		save();
		window.location.reload();
	} catch (e) {
		// Void
	}
}

function versionCheck() {
	let setVersion = true;

	if (player.versionType === undefined || player.version === undefined) {
		player.versionType = "alpha";
		player.version = 0;
	}
	if (player.versionType === "alpha") {
		if (player.version < 10 && player.sb.unl) {
			if (
				confirm(
					"Since the last time you played, several changes to Super-Booster effects have been made. Would you like to roll back your save to that point in the progression, in order for you to experience the new features properly?"
				)
			)
				importSave(SAVES.PRE_SUPER_BOOSTERS);
			setVersion = false;
		}
	}
	if (player.versionType === "beta") {
		if (player.version <= 1.1)
			if (!(player.hb.unl || player.ss.unl)) {
				player.hb.order = 0;
				player.ss.order = 0;
			}
	}

	if (setVersion) {
		player.versionType = getStartPlayer().versionType;
		player.version = getStartPlayer().version;
	}
}

function checkForVars() {
	const start = getStartPlayer();
	for (const key in start) {
		if (player[key] === undefined) player[key] = start[key];
	}
	if (player.k.auto === undefined) player.k.auto = false;
}

function convertToDecimal() {
	player.points = new Decimal(player.points);
	player.p.points = new Decimal(player.p.points);
	player.p.best = new Decimal(player.p.best);
	player.k.points = new Decimal(player.k.points);
	player.k.best = new Decimal(player.k.best);
	player.s.points = new Decimal(player.s.points);
	player.s.best = new Decimal(player.s.best);
	player.f.points = new Decimal(player.f.points);
	player.f.best = new Decimal(player.f.best);
	player.f.things = new Decimal(player.f.things);
	player.f.factories = player.f.factories.map(fac => new Decimal(fac));
	player.b.points = new Decimal(player.b.points);
	player.b.best = new Decimal(player.b.best);
	player.r.points = new Decimal(player.r.points);
	player.r.fuel = new Decimal(player.r.fuel);
	player.r.best = new Decimal(player.r.best);
	player.c.points = new Decimal(player.c.points);
	player.c.power = new Decimal(player.c.power);
	player.c.best = new Decimal(player.c.best);
	player.o.points = new Decimal(player.o.points);
	player.o.best = new Decimal(player.o.best);
	player.w.points = new Decimal(player.w.points);
	player.w.wisdom = new Decimal(player.w.wisdom);
	player.w.best = new Decimal(player.w.best);
	player.w.acuity = player.w.acuity.map(acc => new Decimal(acc));
}

function toggleOpt(name) {
	player[name] = !player[name];
}

function exponentialFormat(num) {
	const e = num.log10().floor();
	const m = num.div(Decimal.pow(10, e));
	return `${m.toStringWithDecimalPlaces(3)}e${e.toStringWithDecimalPlaces(
		0
	)}`;
}

function commaFormat(num, precision) {
	if (num === null || num === undefined) return "NaN";
	return num
		.toStringWithDecimalPlaces(precision)
		.replace(/\B(?=(\d{3})+(?!\d))/gu, ",");
}

function format(decimal, precision = 3) {
	decimal = new Decimal(decimal);
	if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
		player.hasNaN = true;
		return "NaN";
	}
	if (decimal.eq(1 / 0)) return "Infinity";
	if (decimal.gte("eee1000")) return exponentialFormat(decimal, precision);
	if (decimal.gte("ee1000")) return `ee${format(decimal.log10().log10())}`;
	if (decimal.gte("1e1000"))
		return `${decimal
			.div(Decimal.pow(10, decimal.log10().floor()))
			.toStringWithDecimalPlaces(3)}e${format(decimal.log10().floor())}`;
	if (decimal.gte(1e9)) return exponentialFormat(decimal, precision);
	if (decimal.gte(1e3)) return commaFormat(decimal, 0);
	return commaFormat(decimal, precision);
}

function formatWhole(decimal) {
	return format(decimal, 0);
}

function formatTime(s) {
	if (s < 60) return `${format(s)}s`;
	if (s < 3600)
		return `${formatWhole(Math.floor(s / 60))}m ${format(s % 60)}s`;
	return `${formatWhole(Math.floor(s / 3600))}h ${formatWhole(
		Math.floor(s / 60) % 60
	)}m ${format(s % 60)}s`;
}

function showTab(name) {
	if (!TAB_REQS[name]()) return;
	player.tab = name;
	if (name === "tree") needCanvasUpdate = true;
}

function canBuyMax(layer) {
	switch (layer) {
		case "k":
			return player.f.best.gte(1);
		case "f":
			return player.f.best.gte(12);
    case "r":
      return player.c.best.gte(6);
    case "b":
      return player.o.best.gte(6);
		default:
			return false;
	}
}

function getLayerReq(layer) {
	let req = LAYER_REQS[layer];
	switch (
		layer
		// Example:
		// case "x":
		//    return new Decimal(5);
	) {
	}
	return req;
}

function getLayerGainMult(layer) {
	let mult = new Decimal(1);
	switch (layer) {
		case "p":
			if (player.p.upgrades.includes(21)) mult = mult.times(2);
			if (player.p.upgrades.includes(23))
				mult = mult.times(LAYER_UPGS.p[23].currently());
			if (player.p.upgrades.includes(31))
				mult = mult.times(LAYER_UPGS.p[31].currently());
			if (player.p.upgrades.includes(32))
				mult = mult.times(LAYER_UPGS.p[32].currently());
			if (player.k.upgrades.includes(12))
				mult = mult.times(LAYER_UPGS.k[12].currently());
			if (player.k.upgrades.includes(21))
				mult = mult.times(LAYER_UPGS.k[21].currently());
			if (player.k.unl) mult = mult.mul(LAYER_EFFS.k());
			if (player.k.upgrades.includes(24)) mult = mult.pow(1.25);
    	if (player.r.unl) mult = mult.pow(LAYER_EFFS.r());
      if (player.c.unl)
        mult = mult.mul(getChaosPower())
      mult = expoSoftcap(mult, 4, 1e14000)
			break;
    case "k":
			if (player.f.upgrades.includes(24)) mult = mult.div(LAYER_UPGS.f[24].currently());
			if (player.w.upgrades.includes(22)) mult = mult.div(LAYER_UPGS.w[22].currently());
    	if (player.o.unl) mult = mult.div(LAYER_EFFS.o());
      break;
		case "s":
			if (player.f.upgrades.includes(21)) mult = mult.times(LAYER_UPGS.f[21].currently());
    	if (player.r.unl) mult = mult.pow(LAYER_EFFS.r());
      if (player.c.unl)
        mult = mult.mul(getChaosPower())
			break;
    case "f":
			if (player.f.upgrades.includes(22)) mult = mult.div(LAYER_UPGS.f[22].currently());
    	if (player.o.unl) mult = mult.div(LAYER_EFFS.o());
      break;
    case "b":
			if (player.r.upgrades.includes(13)) mult = mult.div(LAYER_UPGS.r[13].currently());
    	if (player.o.unl) mult = mult.div(LAYER_EFFS.o());
      if (player.w.unl) mult = mult.div(getAcuityStuff(2, "boost"))
      break;
    case "r":
    	if (player.o.unl) mult = mult.div(LAYER_EFFS.o());
      if (player.w.unl) mult = mult.div(getAcuityStuff(4, "boost"))
      break;
    case "o":
			if (player.o.upgrades.includes(32)) mult = mult.div(LAYER_UPGS.o[32].currently());
			if (player.w.upgrades.includes(21)) mult = mult.div(LAYER_UPGS.w[21].currently());
    case "c":
			if (player.c.upgrades.includes(32)) mult = mult.div(LAYER_UPGS.c[32].currently());
			if (player.w.upgrades.includes(21)) mult = mult.div(LAYER_UPGS.w[21].currently());
      break;
    case "w":
			if (player.w.upgrades.includes(14)) mult = mult.div(LAYER_UPGS.w[14].currently());
      break;
	}
	return mult;
}

function getGainExp(layer) {
	let exp = new Decimal(1);
	switch (layer) {
		case "p":
			// Example:
			// if (x) {exp = exp.div(y)}
			break;
	}
	return exp;
}

function getResetGain(layer) {
	if (LAYER_TYPE[layer] === "static") {
		if (!canBuyMax(layer) || tmp.layerAmt[layer].lt(tmp.layerReqs[layer]))
			return new Decimal(1);
		let gain = tmp.layerAmt[layer]
			.div(tmp.layerReqs[layer])
			.div(tmp.gainMults[layer])
			.max(1)
			.log(LAYER_BASE[layer])
			.pow(new Decimal(1).div(LAYER_EXP[layer]));
		if (gain.gte(12)) gain = gain.times(12).sqrt();
		if (gain.gte(1225)) gain = gain.times(Decimal.pow(1225, 9)).pow(0.1);
		return gain.floor().sub(player[layer].points).plus(1).max(1);
	}
	if (tmp.layerAmt[layer].lt(tmp.layerReqs[layer])) return new Decimal(0);
	const gain = tmp.layerAmt[layer]
		.div(tmp.layerReqs[layer])
		.pow(LAYER_EXP[layer])
		.times(tmp.gainMults[layer])
		.pow(getGainExp(layer));
	return gain.floor().max(0);
}

function getNextAt(layer) {
	if (LAYER_TYPE[layer] === "static") {
		let amt = player[layer].points;
		if (amt.gte(1225)) amt = amt.pow(10).div(Decimal.pow(1225, 9));
		if (amt.gte(12)) amt = amt.pow(2).div(12);
		const extraCost = Decimal.pow(
			LAYER_BASE[layer],
			amt.pow(LAYER_EXP[layer])
		).times(tmp.gainMults[layer]);
		let cost = extraCost
			.times(tmp.layerReqs[layer])
			.max(tmp.layerReqs[layer]);
		if (LAYER_RES_CEIL.includes(layer)) cost = cost.ceil();
		return cost;
	}
	let next = tmp.resetGain[layer]
		.plus(1)
		.root(getGainExp(layer))
		.div(tmp.gainMults[layer])
		.root(LAYER_EXP[layer])
		.times(tmp.layerReqs[layer])
		.max(tmp.layerReqs[layer]);
	if (LAYER_RES_CEIL.includes(layer)) next = next.ceil();
	return next;
}

function layerUnl(layer) {
	switch (layer) {
		case "p":
			return true;
		case "s":
			return player.k.unl;
		case "f":
			return player.s.unl;
		case "b":
			return player.f.unl;
		case "r":
			return player.b.unl;
		case "c":
			return player.r.unl;
		case "o":
			return player.r.unl;
		case "w":
			return player.o.unl;
		default:
			return player.p.unl;
	}
}

function rowReset(row, layer) {
	// Deep Copy
	// const prev = JSON.parse(JSON.stringify(player));
	// const start = getStartPlayer();
	switch (row) {
		case 0:
			player.points = new Decimal(0);
			break;
		case 1:
			player.points = new Decimal(10);
			player.p.points = new Decimal(0);
			if (
				(layer === "k" && player.k.best.lt(5)) ||
				(layer === "s" && player.s.best.lt(10))
			)
				player.p.upgrades = [];
			break;
		case 2:
			player.points = new Decimal(10);
			player.p.points = new Decimal(0);
			if (
				(layer === "f" && player.f.best.lt(5)) ||
				(layer === "b" && player.b.best.lt(1))
			)
				player.p.upgrades = [];
			player.k.points = new Decimal(0);
			if (
				(layer === "f" && player.f.best.lt(3)) ||
				(layer === "b" && player.b.best.lt(4))
			)
				player.k.best = new Decimal(0);
			player.s.points = new Decimal(0);
			if (
        ((layer === "f" && player.f.best.lt(3)) || layer === "b")
         )
				player.s.best = new Decimal(0);
			if (
				(layer === "f" && player.f.best.lt(4)) ||
				(layer === "b" && player.b.best.lt(2))
			) {
				player.k.upgrades = [];
				player.s.upgrades = [];
			}
      break;
    case 3:
			player.points = new Decimal(10);
			player.p.points = new Decimal(0);
			player.k.points = new Decimal(0);
			if (
				(layer === "r" && player.r.best.lt(2))
			) {
				player.k.upgrades = [];
        player.k.best = new Decimal(0)
			}
			player.s.points = new Decimal(0);
			if (
				(layer === "r" && player.r.best.lt(3))
			) {
				player.s.upgrades = [];
        player.s.best = new Decimal(0)
			}
			if (
				(layer === "r" && player.r.best.lt(4))
			) {
				player.f.upgrades = [];
        player.f.best = new Decimal(0)
        player.f.factories = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)];
			}
			if (
				(layer === "r" && player.r.best.lt(5))
			) {
	    	player.f.points = new Decimal(0);
        player.b.points = new Decimal(0)
        player.b.best = new Decimal(0)
			}
      player.r.fuel = new Decimal(0)
			break;
    case 4:
			player.points = new Decimal(10);
			player.p.points = new Decimal(0);
			player.k.points = new Decimal(0);
      if (player.o.best.lt(1) || player.c.best.lt(1))
        player.r.best = new Decimal(9)
      if (player.o.best.lt(2) || player.c.best.lt(2)) {
        player.k.best = new Decimal(5)
        player.s.best = new Decimal(10)
      }
      if (player.c.best.lt(3))
        player.f.best = new Decimal(12)
      if (player.o.best.lt(3))
        player.b.best = new Decimal(4)
			if (
        (player.c.best.lt(2) || player.o.best.lt(2))
			) {
				player.k.upgrades = [];
			}
			player.s.points = new Decimal(0);
			if (
        (player.c.best.lt(2) || player.o.best.lt(2))
			) {
				player.s.upgrades = [];
			}
			if (
        (player.c.best.lt(3))
			) {
	    	player.f.points = new Decimal(0);
				player.f.upgrades = [];
        player.f.factories = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)];
			}
			if (
        (player.o.best.lt(3))
			) {
        player.b.points = new Decimal(0)
			}
      player.r.fuel = new Decimal(0)
			if (
				(player.o.best.lt(4) || player.c.best.lt(4))
			) {
	    	player.r.points = new Decimal(0);
			}
			break;
	}
}

function doReset(layer, force = false) {
	if (!force) {
		if (tmp.layerAmt[layer].lt(tmp.layerReqs[layer])) return;
		const gain = tmp.resetGain[layer];
		if (LAYER_TYPE[layer] === "static") {
			if (tmp.layerAmt[layer].lt(tmp.nextAt[layer])) return;
			player[layer].points = player[layer].points.plus(
				canBuyMax(layer) ? gain : 1
			);
		} else player[layer].points = player[layer].points.plus(gain);
		player[layer].best = player[layer].best.max(player[layer].points);

		if (!player[layer].unl) {
			player[layer].unl = true;
			needCanvasUpdate = true;

			const layers = ROW_LAYERS[LAYER_ROW[layer]];
			for (const i in layers)
				if (!player[layers[i]].unl && player[layers[i]] !== undefined)
					player[layers[i]].order += ORDER_UP[
						LAYER_ROW[layer]
					].includes(layer)
						? 1
						: 0;
		}

		// Quick fix
		tmp.layerAmt[layer] = new Decimal(0);
	}

	// Example "doesnt reset anything" milestone:
	// if (layer === "x" && player.y.best.gte(1e100)) return;
	if (layer === "k" && player.f.best.gte(1)) return;
	const row = LAYER_ROW[layer];
	if (row === 0) rowReset(0, layer);
	else for (let x = row; x >= 1; x--) rowReset(x, layer);

	updateTemp();
}

function buyUpg(layer, id) {
	if (!player[layer].unl) return;
	if (!LAYER_UPGS[layer][id].unl()) return;
	if (player[layer].upgrades.includes(id)) return;
	if (player[layer].points.lt(LAYER_UPGS[layer][id].cost)) return;
	player[layer].points = player[layer].points.sub(LAYER_UPGS[layer][id].cost);
	player[layer].upgrades.push(id);
}

function getPointGen() {
	let gain = new Decimal(1);
	if (player.p.upgrades.includes(12))
		gain = gain.times(LAYER_UPGS.p[12].currently());
	if (player.p.upgrades.includes(13))
		gain = gain.times(LAYER_UPGS.p[13].currently());
	if (player.p.upgrades.includes(22))
		gain = gain.times(LAYER_UPGS.p[22].currently());
	if (player.p.upgrades.includes(31))
		gain = gain.times(LAYER_UPGS.p[31].currently());
	if (player.k.upgrades.includes(11))
		gain = gain.times(LAYER_UPGS.k[11].currently());

	if (player.p.upgrades.includes(33))
		gain = gain.pow(LAYER_UPGS.p[33].currently());

	gain = gain.mul(getThingMult());
	if (player.r.unl) gain = gain.pow(LAYER_EFFS.r());
  if (player.c.unl)
    gain = gain.mul(getChaosPower())

	return gain;
}

function getFuelGen() {
  let gain = LAYER_UPGS.r[21].currently()
  
  if (player.o.upgrades.includes(31))
    gain = gain.mul(LAYER_UPGS.o[31].currently())
  
  if (player.r.upgrades.includes(12))
    gain = gain.mul(LAYER_UPGS.r[12].currently())
  if (player.r.upgrades.includes(22))
    gain = gain.mul(LAYER_UPGS.r[22].currently())
  if (player.r.upgrades.includes(32))
    gain = gain.mul(LAYER_UPGS.r[32].currently())
  if (player.f.upgrades.includes(23))
    gain = gain.mul(LAYER_UPGS.f[23].currently())
	if (player.o.upgrades.includes(11)) gain = gain.mul(LAYER_UPGS.o[11].currently().add(1));
  if (player.c.unl)
    gain = gain.mul(getChaosPower())
  if (player.w.unl) gain = gain.mul(getAcuityStuff(1, "boost"))
  
  return gain;
}

function getChaosGen() {
  let gain = LAYER_EFFS.c()
  
  if (player.c.upgrades.includes(11))
    gain = gain.mul(LAYER_UPGS.c[11].currently())
  if (player.w.upgrades.includes(11))
    gain = gain.mul(LAYER_UPGS.w[11].currently())
  
  if (player.c.upgrades.includes(31))
    gain = gain.pow(LAYER_UPGS.c[31].currently())
  
  return gain;
}

function getOrderPower() {
  let power = new Decimal(1.45)
  
	if (player.o.upgrades.includes(22)) power = power.pow(LAYER_UPGS.o[22].currently().add(1));
  if (player.o.upgrades.includes(21)) power = power.pow(LAYER_UPGS.o[21].currently().add(1))
  if (player.o.upgrades.includes(31)) power = power.pow(LAYER_UPGS.o[31].currently().add(1))
  
  return power.pow(player.o.points)
}

function getChaosPower() {
  let power = player.c.power
  
	if (player.c.upgrades.includes(22)) power = power.pow(LAYER_UPGS.c[22].currently().add(1));
  
  return power.pow(215).add(1).log10().add(1)
}

function resetRow(row) {
	if (
		prompt(
			"Are you sure you want to reset this row? It is highly recommended that you wait" +
				' until the end of your current run before doing this! Type "I WANT TO RESET THIS" to confirm'
		) !== "I WANT TO RESET THIS"
	)
		return;
	const preLayers = ROW_LAYERS[row - 1];
	const layers = ROW_LAYERS[row];
	const postLayers = ROW_LAYERS[row + 1];
	rowReset(row + 1, postLayers[0]);
	doReset(preLayers[0], true);
	for (const layer in layers) {
		player[layers[layer]].unl = false;
		if (player[layers[layer]].order) player[layers[layer]].order = 0;
	}
	updateTemp();
	resizeCanvas();
}

function toggleAuto(layer, end = "") {
	if (player[layer][`auto${end}`] === undefined) return;
	player[layer][`auto${end}`] = !player[layer][`auto${end}`];
}

function adjustMSDisp() {
	const displays = ["always", "automation", "incomplete", "never"];
	player.msDisplay = displays[(displays.indexOf(player.msDisplay) + 1) % 4];
}

function milestoneShown(complete, auto = false) {
	switch (player.msDisplay) {
		case "always":
			return true;
		case "automation":
			return auto || !complete;
		case "incomplete":
			return !complete;
		case "never":
			return false;
	}
	return false;
}

function getAcuityStuff(id, type) {
  switch (type) {
    case "gain":
      let goal = player.w.points
			if (player.w.upgrades.includes(13)) goal = goal.add(LAYER_UPGS.w[13].currently());
      switch (id) {
        case 1:
          return goal.sqrt()
          break;
        case 2:
          return goal.sqrt().div(10)
          break;
        case 3:
          return goal.add(1).log10()
          break;
        case 4:
          return goal.cbrt().sub(0.5).mul(2)
          break;
        case 5:
          return goal.add(1).log10().pow(1.5).div(10)
          break;
    }
    break;
    case "boost":
      switch (id) {
        case 1:
          return player.w.acuity[0].add(1).log10().add(1).pow(10)
          break;
        case 2:
          return player.w.acuity[1].add(1).log10().div(10).add(1).pow(10)
          break;
        case 3:
          return player.w.acuity[2].add(1).log10().div(10)
          break;
        case 4:
          return player.w.acuity[3].add(1).log10().div(10).add(1).pow(10)
          break;
        case 5:
          return player.w.acuity[4].add(1).log10().div(10)
          break;
    }
    break;
    case "power":
      switch (id) {
        case 1:
          return "Multiply gain of rocket fuel by " + format(getAcuityStuff(id, "boost")) + "x"
          break;
        case 2:
          return "Divide book cost by /" + format(getAcuityStuff(id, "boost"))
          break;
        case 3:
          return "Increase rocket fuel power by " + format(getAcuityStuff(id, "boost").div(100)) + "%"
          break;
        case 4:
          return "Divide rocket cost by /" + format(getAcuityStuff(id, "boost"))
          break;
        case 5:
          return "Give " + format(getAcuityStuff(id, "boost")) + " free books"
          break;
    }
  break;
  }
}

function gameLoop(diff) {
	diff = new Decimal(diff);
	if (isNaN(diff.toNumber())) diff = new Decimal(0);
	player.timePlayed += diff.toNumber();
	if (player.p.upgrades.includes(11))
		player.points = player.points.add(tmp.pointGen.mul(diff)).max(0);

	if (player.s.best.gte(5) || player.c.best.gte(1))
		player.p.points = player.p.points.add(tmp.resetGain.p.mul(diff).max(0));

	if (player.f.best.gte(2))
		player.s.points = player.s.points.add(tmp.resetGain.s.mul(diff).max(0));
  
  if (player.r.upgrades.includes(21))
    player.r.fuel = player.r.fuel.add(getFuelGen().mul(diff).max(0))
  
  if (player.c.unl) player.c.power = player.c.power.add(getChaosGen().mul(diff).max(0))

	if (player.k.auto && player.f.best.gte(8)) doReset("k");

	const BEST_CHECK = ["p", "s"];
	BEST_CHECK.forEach(layer => {
		if (player[layer].points.gt(player[layer].best))
			player[layer].best = player[layer].points;
	});

	tickFactories(diff);
  
  if (player.w.unl) {
    for (var i=0; i<5; i++) {
      player.w.acuity[i] = player.w.acuity[i].add(getAcuityStuff(i+1, "gain").mul(diff).max(0))
    }
  }
  
  player.f.things = player.f.things.max(1)

	if (player.hasNaN && !NaNalert) {
		alert(
			"We have detected a corruption in your save. Please visit https://discord.gg/wwQfgPa for help."
		);
		clearInterval(interval);
		player.autosave = false;
		NaNalert = true;
	}
}

function hardReset() {
	if (
		!confirm(
			"Are you sure you want to do this? You will lose all your progress!"
		)
	)
		return;
	player = getStartPlayer();
	save();
	window.location.reload();
}

const saveInterval = setInterval(() => {
	if (player === undefined) return;
	if (player.autosave) save();
}, 5000);

let interval = setInterval(() => {
	if (player === undefined || tmp === undefined) return;
	let diff = (Date.now() - player.time) / 1000;
	if (!player.offlineProd) offTime.remain = 0;
	if (offTime.remain > 0) {
		offTime.speed = offTime.remain / 5 + 1;
		diff += offTime.speed / 50;
		offTime.remain = Math.max(offTime.remain - offTime.speed / 50, 0);
	}
	player.time = Date.now();
	if (needCanvasUpdate) resizeCanvas();
	updateTemp();
	gameLoop(new Decimal(diff));
}, 50);

document.onkeydown = e => {
	if (player === undefined) return;
	const shiftDown = e.shiftKey;
	const ctrlDown = e.ctrlKey;
	const key = e.key;
	if (!LAYERS.includes(key) || ctrlDown || shiftDown) {
		// Other keybinds...
	} else if (player[key].unl) doReset(key);
};