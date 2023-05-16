import { ECharts, EChartsOption } from "echarts"
import EChartsReact from "echarts-for-react"
import {
	createDomain,
	createEffect,
	createEvent,
	createStore,
	sample,
} from "effector"
import { createGate, useUnit } from "effector-react"
import { delay } from "patronum"
import { attachLogger } from "effector-logger"
import { MutableRefObject } from "react"

import * as config from "../config"
import { pipe } from "fp-ts/function"
import { set } from "spectacles-ts"

// export const option: EChartsOption = {
// 	title: {
// 		text: "ECharts Getting Started Example",
// 	},
// 	tooltip: {},
// 	legend: {
// 		data: ["sales"],
// 	},
// 	xAxis: {
// 		data: ["Shirts", "Cardigans", "Chiffons", "Pants", "Heels", "Socks"],
// 	},
// 	yAxis: {},
// 	series: [
// 		{
// 			name: "sales",
// 			type: "bar",
// 			data: [5, 20, 36, 10, 10, 20],
// 		},
// 	],
// }

type GateState = {
  echartReactInstance: MutableRefObject<null | EChartsReact>;
};

const defaultState: GateState = {
	echartReactInstance: { current: null },
}
const domain = createDomain()

attachLogger(domain)

export const Gate = createGate({ domain, defaultState })

const setInstanceFx = createEffect({
	handler: async () => await Promise.resolve("hello"),
	domain,
})

const updateOption = ({
	instance,
	option,
}: {
  instance: ECharts;
  option: EChartsOption;
}) => {
	instance.setOption(option)
	return option
}

const setOptionFx = createEffect({
	handler: updateOption,
	domain,
})

const updateSales = createEvent<number[]>({ domain })

const $sales = createStore<number[]>([])

const $instance = createStore<null | GateState["echartReactInstance"]>(null, {
	domain,
})
const $echarts = createStore<null | ECharts>(null, {
	domain,
})
const $option = createStore<EChartsOption>(config.option, { domain })

$instance.on(Gate.open, (_, { echartReactInstance }) => echartReactInstance)
$echarts.on($instance.updates, (_, ref) => ref?.current?.getEchartsInstance())
$option.on(setOptionFx.doneData, (_, option) => option)
$sales.on(updateSales, (sales, newSales) => [...sales, ...newSales])

sample({
	clock: $echarts.updates,
	filter: (instance): instance is ECharts => !!instance,
	fn: (instance) => ({ instance, option: config.option }),
	target: setOptionFx,
})

sample({
	clock: $sales.updates,
	source: { option: $option, instance: $echarts },
	filter: ({ instance }) => !!instance,
	fn: ({ instance, option }, sales) => ({
		instance,
		option: pipe(option, set("series.[]>.name:sales.data", sales)),
	}),
	target: setOptionFx,
})

// some outer world data updates
setTimeout(() => {
	updateSales([1])
	setTimeout(() => {
		updateSales([10])
		setTimeout(() => {
			updateSales([35])
			setTimeout(() => {
				updateSales([80])
				setTimeout(() => {
					updateSales([85])
					setTimeout(() => {
						updateSales([65])
						setTimeout(() => {
							updateSales([23])
						}, 1000)
					}, 1000)
				}, 1000)
			}, 1000)
		}, 1000)
	}, 1000)
}, 2000)

export const useModel = () =>
	useUnit({
		option: $option,
	})
