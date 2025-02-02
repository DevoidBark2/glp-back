import { Injectable } from '@nestjs/common'
import * as PDFDocument from 'pdfkit'
import * as fs from 'fs'

@Injectable()
export class PdfService {
	async generate() {
		// 	const echartOption = {
		// 		tooltip: {
		// 			trigger: 'axis',
		// 			axisPointer: {
		// 				type: 'shadow'
		// 			}
		// 		},
		// 		grid: {
		// 			left: '3%',
		// 			right: '4%',
		// 			bottom: '3%',
		// 			containLabel: true
		// 		},
		// 		xAxis: [
		// 			{
		// 				type: 'category',
		// 				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		// 				axisTick: {
		// 					alignWithLabel: true
		// 				}
		// 			}
		// 		],
		// 		yAxis: [
		// 			{
		// 				type: 'value'
		// 			}
		// 		],
		// 		series: [
		// 			{
		// 				name: 'Direct',
		// 				type: 'bar',
		// 				barWidth: '60%',
		// 				data: [10, 52, 200, 334, 390, 330, 220]
		// 			}
		// 		]
		// 	}

		// 	const htmlCode = `
		//   <!DOCTYPE html>
		//   <html>
		//   <head>
		//     <title>Simple HTML Table</title>
		//   </head>
		//   <body>
		//     <table>
		//       <tr>
		//         <th>Name</th>
		//         <th>Age</th>
		//         <th>City</th>
		//       </tr>
		//       <tr>
		//         <td>John</td>
		//         <td>25</td>
		//         <td>New York</td>
		//       </tr>
		//       <tr>
		//         <td>Amy</td>
		//         <td>32</td>
		//         <td>London</td>
		//       </tr>
		//       <tr>
		//         <td>Michael</td>
		//         <td>40</td>
		//         <td>Paris</td>
		//       </tr>
		//     </table>
		//   </body>
		//   </html>
		// `
		// 	const pdfDoc = new PDFDocument()
		// 	const filePath = './chart.pdf'
		// 	const out = fs.createWriteStream(filePath)

		// 	pdfDoc.pipe(out)
		// 	pdfDoc.end()

		// 	await new Promise((resolve, reject) => {
		// 		out.on('finish', resolve)
		// 		out.on('error', reject)
		// 	})

		// 	return filePath
	}
}
