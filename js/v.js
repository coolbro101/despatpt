"use strict";

let app;

function loadVue() {
	app = new Vue({
		el: "#app",
		data: {
			player,
			tmp,
			offTime,
			Decimal,
			format,
			formatWhole,
			formatTime,
			layerUnl,
			getLayerEffDesc,
			doReset,
			buyUpg,
			milestoneShown,
			getThingMult,
			buyFactory,
      getFuelGen,
      getFactoryCost,
      rocketFuelPower,
      getChaosGen,
      getChaosPower,
      getOrderPower,
      getAcuityStuff,
			LAYERS,
			LAYER_RES,
			LAYER_TYPE,
			LAYER_UPGS,
			LAYER_EFFS,
			LAYER_AMT_NAMES,
			LAYER_RES_CEIL,
			FACTORY_COSTS,
		},
	});
}
