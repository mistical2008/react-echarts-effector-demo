import { EChartsOption } from "echarts"

export const option: EChartsOption = {
	title: {
		text: "ECharts Getting Started Example",
	},
	tooltip: { show: true },
	legend: {
		data: ["sales"],
	},
	xAxis: {
		data: ["Shirts", "Cardigans", "Chiffons", "Pants", "Heels", "Socks"],
	},
	yAxis: {},
	series: [
		{
			name: "sales",
			type: "line",
			data: [],
		},
	],
}
