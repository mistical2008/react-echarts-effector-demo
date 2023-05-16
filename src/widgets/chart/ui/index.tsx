import EChartsReact from "echarts-for-react"
import { useRef } from "react"
import { useGate } from "effector-react"
import * as model from "../model"
import * as config from "../config"

export const Chart = () => {
	const echartReactRef = useRef<null | EChartsReact>(null)
	useGate(model.Gate, { echartReactInstance: echartReactRef })
	const { option } = model.useModel()

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<EChartsReact ref={(e) => (echartReactRef.current = e)} option={option} />
		</div>
	)
}
