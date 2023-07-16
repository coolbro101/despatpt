"use strict";

const LAYER_UPGS = {
	p: {
		rows: 4,
		cols: 3,
		11: {
			desc: "Gain 1 Point every second.",
			cost: new Decimal(1),
			unl() {
				return player.p.unl;
			},
		},
		12: {
			desc:
				"Point generation is faster based on your unspent Prestige Points.",
			cost: new Decimal(1),
			unl() {
				return player.p.upgrades.includes(11);
			},
			currently() {
				return expoSoftcap(player.p.points
					.plus(1)
					.pow(player.p.upgrades.includes(41) ? 0.75 : 0.5), 2, "1e18000")
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		13: {
			desc: "Point generation is faster based on your Point amount.",
			cost: new Decimal(5),
			unl() {
				return player.p.upgrades.includes(12);
			},
			currently() {
				let ret = player.points.plus(1).log10().pow(0.75).plus(1);
				if (player.p.upgrades.includes(43)) ret = ret.pow(2);
				return ret;
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		21: {
			desc: "Prestige Point gain is doubled.",
			cost: new Decimal(20),
			unl() {
				return player.p.upgrades.includes(11);
			},
		},
		22: {
			desc:
				"Point generation is faster based on your Prestige Upgrades bought.",
			cost: new Decimal(75),
			unl() {
				return player.p.upgrades.includes(12);
			},
			currently() {
				return Decimal.pow(1.4, player.p.upgrades.length);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		23: {
			desc: "Prestige Point gain is boosted by your Point amount.",
			cost: new Decimal(1000),
			unl() {
				return player.p.upgrades.includes(13);
			},
			currently() {
				let ret = player.points.plus(1).log10().cbrt().plus(1);
				return ret;
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		31: {
			desc: "Point gain is multiplied by 10.",
			cost: new Decimal(1e6),
			unl() {
				return (
					player.k.upgrades.includes(13) &&
					player.p.upgrades.includes(21)
				);
			},
			currently() {
				return 10;
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		32: {
			desc: "Prestige Point gain is multiplied based on Prestige Points.",
			cost: new Decimal(1e9),
			unl() {
				return player.p.upgrades.includes(31);
			},
			currently() {
				return player.p.points.add(1).log10().add(1).log10().add(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		33: {
			desc: "Raise Point gain to the power of 1.25.",
			cost: new Decimal(1e16),
			unl() {
				return player.p.upgrades.includes(31);
			},
			currently() {
				return new Decimal(1.25);
			},
			effDisp(x) {
				return `^${format(x)}`;
			},
		},
		41: {
			desc: "The second Prestige Upgrade uses a better formula.",
			cost: new Decimal(1e38),
			unl() {
				return (
					player.s.upgrades.includes(12) &&
					player.p.upgrades.includes(31)
				);
			},
		},
		42: {
			desc: "The first Knowledge Upgrade uses a better formula.",
			cost: new Decimal(1e65),
			unl() {
				return player.p.upgrades.includes(41);
			},
		},
		43: {
			desc: "The third Prestige Upgrade uses a better formula.",
			cost: new Decimal(1e92),
			unl() {
				return player.p.upgrades.includes(41);
			},
		},
	},
	k: {
		rows: 2,
		cols: 4,
		11: {
			desc: "Multiply Point gain based on your knowledge.",
			cost: new Decimal(4),
			unl() {
				return player.k.unl;
			},
			currently() {
				return player.k.points
					.add(1)
					.pow(player.p.upgrades.includes(42) ? 2 : 1.25);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		12: {
			desc: "Multiply Prestige Point gain based on your points.",
			cost: new Decimal(5),
			unl() {
				return player.k.upgrades.includes(11);
			},
			currently() {
				return player.points.add(1).log10();
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		13: {
			desc: "Unlock a new row of Prestige Upgrades.",
			cost: new Decimal(5),
			unl() {
				return player.k.upgrades.includes(12);
			},
		},
		14: {
			desc: "Double the knowledge base.",
			cost: new Decimal(26),
			unl() {
				return (
					player.k.upgrades.includes(13) &&
					player.s.upgrades.includes(22)
				);
			},
			currently() {
				return new Decimal(2);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		21: {
			desc: "Multiply Prestige Point gain based on your knowledge.",
			cost: new Decimal(8),
			unl() {
				return player.k.upgrades.includes(13);
			},
			currently() {
				return player.k.points.add(1).pow(1.5);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		22: {
			desc: "Add 1 to the knowledge base.",
			cost: new Decimal(9),
			unl() {
				return player.k.upgrades.includes(21);
			},
			currently() {
				return new Decimal(1);
			},
			effDisp(x) {
				return `+${format(x)}`;
			},
		},
		23: {
			desc: "Add to Knowledge base based on Prestige Points.",
			cost: new Decimal(13),
			unl() {
				return player.k.upgrades.includes(22);
			},
			currently() {
				return player.p.points.add(1).log(2).add(1).log10();
			},
			effDisp(x) {
				return `+${format(x)}`;
			},
		},
		24: {
			desc: "Raise Prestige Point gain to the power of 1.25.",
			cost: new Decimal(26),
			unl() {
				return (
					player.k.upgrades.includes(23) &&
					player.s.upgrades.includes(22)
				);
			},
			currently() {
				return new Decimal(1.25);
			},
			effDisp(x) {
				return `^${format(x)}`;
			},
		},
	},
	s: {
		rows: 2,
		cols: 2,
		11: {
			desc: "Add 5 free knowledge to the knowledge effect.",
			cost: new Decimal(50),
			unl() {
				return player.s.unl;
			},
			currently() {
				return new Decimal(player.s.upgrades.includes(21) ? 12.5 : 5);
			},
			effDisp(x) {
				return `+${format(x)}`;
			},
		},
		12: {
			desc: "Unlock a new row of Prestige Upgrades.",
			cost: new Decimal(100),
			unl() {
				return player.s.upgrades.includes(11);
			},
		},
		21: {
			desc: "The first Skill Upgrade is 250% stronger.",
			cost: new Decimal(10000),
			unl() {
				return player.s.upgrades.includes(11);
			},
		},
		22: {
			desc: "Unlock a new column of Knowledge Upgrades.",
			cost: new Decimal(250000),
			unl() {
				return player.s.upgrades.includes(21);
			},
		},
	},
	f: {
		rows: 2,
		cols: 5,
		11: {
			desc: "Greatly enhance the thing forumla.",
			cost: new Decimal(3),
			unl() {
				return player.f.unl;
			}
		},
		12: {
			desc: "Things increase knowledge effect base, at a reduced rate.",
			cost: new Decimal(15),
			unl() {
				return player.f.unl;
			},
			currently() {
				return expoSoftcap(player.f.things.pow(0.1), 5, 1e11);
			},
			effDisp(x) {
				return `+${format(x)}`;
			}
		},
		13: {
			desc: "Skills boost factory production.",
			cost: new Decimal(22),
			unl() {
				return player.f.unl;
			},
			currently() {
				return player.s.points.add(1).log10();
			},
			effDisp(x) {
				return `${format(x)}x`;
			}
		},
		14: {
			desc: "Points boost factory production.",
			cost: new Decimal(24),
			unl() {
				return player.f.upgrades.includes(13);
			},
			currently() {
				return player.points.add(1).log10().add(1).sqrt();
			},
			effDisp(x) {
				return `${format(x)}x`;
			}
		},
		15: {
			desc: "Thing effect is rasied to the power of 1.5.",
			cost: new Decimal(43),
			unl() {
				return player.f.upgrades.includes(11);
			},
			currently() {
				return new Decimal(1.5);
			},
			effDisp(x) {
				return `^${format(x)}`;
			}
		},
		21: {
			desc: "Things boost skill gain too.",
			cost: new Decimal(53),
			unl() {
				return player.f.factories[4].gte(1);
			},
			currently() {
				return player.f.things.add(1).log10();
			},
			effDisp(x) {
				return `${format(x)}x`;
			}
		},
		22: {
			desc: "Rocket Fuel and Rockets make Factories cheaper.",
			cost: new Decimal(85),
			unl() {
				return player.r.best.gte(9);
			},
			currently() {
				return player.r.fuel.add(1).log10().add(1).pow(player.r.points.add(1).log10());
			},
			effDisp(x) {
				return `/${format(x)}`;
			},
		},
		23: {
			desc: "Things multiply Rocket Fuel gain",
			cost: new Decimal(90),
			unl() {
				return player.f.upgrades.includes(22);
			},
			currently() {
				return player.f.things.add(1).log10().add(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		24: {
			desc: "Things and points make knowledge cheaper.",
			cost: new Decimal(97),
			unl() {
				return player.f.upgrades.includes(23);
			},
			currently() {
				return player.f.things.add(1).log10().add(1).pow(player.points.add(1).log10().add(1).log10().add(1).pow(1.25).mul(1.25));
			},
			effDisp(x) {
				return `/${format(x)}`;
			},
		},
		25: {
			desc: "Unlock a new column of Rocket Upgrades",
			cost: new Decimal(99),
			unl() {
				return player.f.upgrades.includes(24);
			}
		},
	},
	r: {
		rows: 3,
		cols: 3,
		11: {
			desc: "Rockets add to the knowledge base",
			cost: new Decimal(3),
			currently() {
				return player.r.points.add(1).log10();
			},
			effDisp(x) {
				return `+${format(x)}`;
			},
			unl() {
				return player.r.unl;
			}
		},
		21: {
			desc: "Begin producing rocket fuel",
			cost: new Decimal(4),
			currently() {
				return player.points.add(1).log10().add(1).log10();
			},
			effDisp(x) {
				return `+${format(x)}/s`;
			},
			unl() {
				return player.r.unl;
			}
		},
		31: {
			desc: "Rockets boost the knowledge base",
			cost: new Decimal(6),
			currently() {
				return player.r.points.add(1).log10().add(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
			unl() {
				return player.r.unl;
			}
		},
		12: {
			desc: "Multiply rocket fuel gain based on rockets",
			cost: new Decimal(5),
			currently() {
        if (player.w.upgrades.includes(23)) return player.r.points.add(1).pow(2.5).log(2).add(1).pow(1.5)
				return player.r.points.add(1).pow(2).log10().add(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
			unl() {
				return player.r.upgrades.includes(11);
			}
		},
		22: {
			desc: "Prestige Points multiply rocket fuel gain",
			cost: new Decimal(6),
			currently() {
				return player.p.points.add(1).log10().cbrt().add(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
			unl() {
				return player.r.upgrades.includes(21);
			}
		},
		32: {
			desc: "Rocket fuel boosts itself.",
			cost: new Decimal(9),
			currently() {
        if (player.w.upgrades.includes(23)) return player.r.fuel.add(1).pow(2.5).log(2).add(1).pow(player.r.fuel.cbrt().add(1).log10().add(1).cbrt())
				return player.r.fuel.add(1).log10().add(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
			unl() {
				return player.r.upgrades.includes(31);
			}
		},
		13: {
			desc: "Rockets make books cheaper.",
			cost: new Decimal(18),
			unl() {
				return player.r.upgrades.includes(12) && player.f.upgrades.includes(25);
			},
			currently() {
				return player.r.points.add(1).log10().add(1).log10().add(1);
			},
			effDisp(x) {
				return `/${format(x)}`;
			},
		},
		23: {
			desc: "Base factories boost factory and thing generation.",
			cost: new Decimal(20),
			unl() {
				return player.r.upgrades.includes(22) && player.f.upgrades.includes(25);
			},
			currently() {
				return player.f.points.pow(125).log10().add(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
		},
		33: {
			desc: "Rocket Fuel is stronger based on itself",
			cost: new Decimal(26),
			unl() {
				return player.r.upgrades.includes(32) && player.f.upgrades.includes(25);
			},
			currently() {
				return player.r.fuel.add(1).log10().add(1).log10().add(1).log10();
			},
			effDisp(x) {
				return `${format(x.mul(100))}%`;
			},
		},
  },
	c: {
		rows: 3,
		cols: 2,
		11: {
			desc: "Chaos Power boosts itself",
			cost: new Decimal(3),
			currently() {
				return player.c.power.add(1).log10().pow(2);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
			unl() {
				return player.c.unl;
			}
		},
		12: {
			desc: "Chaos Gems boost Rocket Fuel power",
			cost: new Decimal(5),
			currently() {
				return player.c.points.add(1).log10().add(1).log10();
			},
			effDisp(x) {
				return `${format(x.mul(100))}%`;
			},
			unl() {
				return player.c.upgrades.includes(11);
			}
		},
		21: {
			desc: "You get free Chaos Gems based on your books",
			currently() {
				return player.b.points.add(1).log10();
			},
			effDisp(x) {
				return `+${format(x)}`;
			},
			cost: new Decimal(6),
			unl() {
				return player.c.upgrades.includes(22);
			}
		},
		22: {
			desc: "Chaos Power boost is boosted by Order Power",
			cost: new Decimal(5),
			currently() {
				return player.o.points.add(1).log10().add(1).log10().div(10);
			},
			effDisp(x) {
				return `${format(x.mul(100))}%`;
			},
			unl() {
				return player.c.upgrades.includes(12);
			}
		},
		31: {
			desc: "Order Power boosts Chaos Power gain",
			cost: new Decimal(6),
			currently() {
				return player.o.points.add(1).log10().add(1).pow(player.o.points.pow(0.25));
			},
			effDisp(x) {
				return `${format(x.mul(100))}%`;
			},
			unl() {
				return player.c.upgrades.includes(21);
			}
		},
		32: {
			desc: "Prestige Points divide Chaos Gem cost",
			cost: new Decimal(7),
			currently() {
				return player.p.points.add(1).log10().add(1).log10().add(1).pow(0.5);
			},
			effDisp(x) {
				return `/${format(x)}`;
			},
			unl() {
				return player.c.upgrades.includes(31);
			}
		}
  },
	o: {
		rows: 3,
		cols: 2,
		11: {
			desc: "Order Power multiplies Rocket Fuel gain",
			cost: new Decimal(3),
			currently() {
				return player.o.points.pow(4.5).max(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
			unl() {
				return player.c.unl;
			}
		},
		12: {
			desc: "Order Power boosts Rocket Fuel power",
			cost: new Decimal(5),
			currently() {
				return player.o.points.add(1).log10().add(1).log10();
			},
			effDisp(x) {
				return `${format(x.mul(100))}%`;
			},
			unl() {
				return player.o.upgrades.includes(11);
			}
		},
		21: {
			desc: "Rocket boost Order Power boost",
			cost: new Decimal(6),
			currently() {
				return player.r.best.add(1).log10().add(1).log10().add(1).log10();
			},
			effDisp(x) {
				return `${format(x.mul(100))}%`;
			},
			unl() {
				return player.o.upgrades.includes(22);
			}
		},
		22: {
			desc: "Order Power boost is boosted by Chaos Gems",
			cost: new Decimal(5),
			currently() {
				return player.c.points.add(1).log10().add(1).log10().div(10);
			},
			effDisp(x) {
				return `${format(x.mul(100))}%`;
			},
			unl() {
				return player.o.upgrades.includes(12);
			}
		},
		31: {
			desc: "Chaos Power boosts Order Power boost",
			cost: new Decimal(6),
			currently() {
				return player.c.power.add(1).log10().add(1).log10().add(1).pow(1.3);
			},
			effDisp(x) {
				return `${format(x.mul(100))}%`;
			},
			unl() {
				return player.o.upgrades.includes(21);
			}
		},
		32: {
			desc: "Points decrease Order Power cost.",
			cost: new Decimal(7),
			currently() {
				return player.points.add(1).log10().add(1).log10().add(1).log10().add(1).pow(2);
			},
			effDisp(x) {
				return `/${format(x)}`;
			},
			unl() {
				return player.o.upgrades.includes(31);
			}
		},
  },
	w: {
		rows: 3,
		cols: 4,
		11: {
			desc: "Intelligence boosts Chaos Power gain",
			cost: new Decimal(5),
			currently() {
				return player.w.points.add(1);
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
			unl() {
				return player.w.unl;
			}
		},
	12: {
			desc: "Rocket Fuel boosts itself further",
			cost: new Decimal(7),
			currently() {
				return player.r.fuel.add(1).log10().add(1).sqrt();
			},
			effDisp(x) {
				return `${format(x)}x`;
			},
			unl() {
				return player.w.unl;
			}
		},
	13: {
			desc: "Chaos Gems give free intelligence",
			cost: new Decimal(8),
			currently() {
				return player.c.points.add(1).log10();
			},
			effDisp(x) {
				return `+${format(x)}`;
			},
			unl() {
				return player.w.unl;
			}
		},
	14: {
			desc: "Prestige points divide intelligence cost",
			cost: new Decimal(13),
			currently() {
				return player.p.points.add(1).log10().add(1).log10().add(1).log10().add(1).log10().cbrt().add(1);
			},
			effDisp(x) {
				return `/${format(x)}`;
			},
			unl() {
				return player.w.unl;
			}
		},
	21: {
			desc: "Chaos gems and order power divide the cost of chaos and order resets.",
			currently() {
				return player.c.points.add(player.o.points).add(1).log10().add(1).sqrt();
			},
			effDisp(x) {
				return `/${format(x)}`;
			},
			cost: new Decimal(11),
			unl() {
				return player.w.upgrades.includes(11);
			}
		},
	22: {
			desc: "Total acuity and intelligence divide knowledge cost",
			cost: new Decimal(12),
			currently() {
				return player.w.acuity[0].add(player.w.acuity[1]).add(player.w.acuity[2]).add(player.w.acuity[3]).add(player.w.acuity[4]).add(1).log10().add(1).pow(player.w.points.add(1).sqrt());
			},
			effDisp(x) {
				return `/${format(x)}`;
			},
			unl() {
				return player.w.upgrades.includes(12);
			}
		},
	23: {
			desc: "The fourth and sixth Rocket Upgrades use better formulas.",
			cost: new Decimal(15),
			unl() {
				return player.w.upgrades.includes(13);
			}
		},
	24: {
			desc: "???",
			cost: new Decimal(50000),
			unl() {
				return player.w.upgrades.includes(14);
			}
		},
	31: {
			desc: "???",
			cost: new Decimal(50000),
			unl() {
				return player.w.upgrades.includes(21);
			}
		},
	32: {
			desc: "???",
			cost: new Decimal(50000),
			unl() {
				return player.w.upgrades.includes(22);
			}
		},
	33: {
			desc: "???",
			cost: new Decimal(50000),
			unl() {
				return player.w.upgrades.includes(23);
			}
		},
	34: {
			desc: "???",
			cost: new Decimal(50000),
			unl() {
				return player.w.upgrades.includes(24);
			}
		},
  }
};