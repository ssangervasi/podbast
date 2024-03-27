import { App } from '@tinyhttp/app'
import { narrow } from 'narrow-minded'
import xml from 'xml2js'
import multer from 'multer'

const uploader = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1 * 1000 ** 2,
	},
})

//
export const app = new App()

const parseOpml = async (body: string) => {
	const parser = new xml.Parser()
	const parsed = await parser.parseStringPromise(body)
	return parsed
}

app.post('/opml', uploader.single('content') as any, async (req, res) => {
	const file = (req as any).file as Express.Multer.File
	console.log('>>>>>', {
		file: file.size,
		body: JSON.stringify(req.body, null, 2),
		asf: 'asdf',
	})

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
