import multer from "multer";

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, "./public/temp");
	},
	filename: function (_req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

export const uploadImages = multer({ storage: storage });
