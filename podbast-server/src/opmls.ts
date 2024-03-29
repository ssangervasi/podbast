import { App } from '@tinyhttp/app'
import { narrow } from 'narrow-minded'
import xml from 'xml2js'
import multer from 'multer'

export const parseXml = async (body: string): Promise<unknown> => {
	try {
		const parser = new xml.Parser()
		return await parser.parseStringPromise(body)
	} catch (e) {
		console.error('Parse OPML error', e)
		return undefined
	}
}

export type OutlineFeed = {
	title: string
	url: string
}

export type Outline = {
	feeds: Array<Outline>
}

export const transformOpmlToOutline = (opml: unknown): Outline | undefined => {
	if (
		!narrow(
			{
				opml: {
					body: [
						{
							outline: [
								{
									$: {
										text: 'string',
										type: 'string',
										xmlUrl: 'string',
									},
								},
							],
						},
					],
				},
			},
			opml,
		)
	) {
		return undefined
	}
	return {
		feeds: opml.opml.body.flatMap(({ outline }) => outline) as any,
	}
}

export const parseOpmlOutline = async (body: string): Promise<unknown> => {
	return transformOpmlToOutline(await parseXml(body))
}

const uploader = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1 * 1000 ** 2,
	},
})

//
export const app = new App()

app.post('/opml', uploader.single('content') as any, async (req, res) => {
	const file = (req as any).file as Express.Multer.File

	console.log(file)
	if (!file) {
		return res.sendStatus(400)
	}

	const parsed = await parseOpml(file.buffer.toString())

	res.json({
		content: parsed,
	})
})

const html = (strings: ArrayLike<string>, ...values: any[]) =>
	String.raw({ raw: strings }, ...values)

app.get('/opml', async (req, res) => {
	res.send(
		html`
			<!DOCTYPE html>
			<html lang="en-US">
				<head>
					<title>OPML</title>
				</head>
				<body>
					<h2>OPML</h2>
					<form method="post" enctype="multipart/form-data">
						<input type="text" name="text" />
						<input type="file" name="content" />
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`,
	)
})
