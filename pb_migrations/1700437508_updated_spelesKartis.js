/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "bmjdzlan",
				name: "tips",
				type: "select",
				required: false,
				presentable: false,
				unique: false,
				options: {
					maxSelect: 1,
					values: ["jautajuma", "atbilzu"]
				}
			})
		)

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "phr8kbb0",
				name: "virsraksts",
				type: "text",
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ""
				}
			})
		)

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "7rbaqkii",
				name: "saturs",
				type: "text",
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ""
				}
			})
		)

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

		// remove
		collection.schema.removeField("bmjdzlan")

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "phr8kbb0",
				name: "title",
				type: "text",
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ""
				}
			})
		)

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "7rbaqkii",
				name: "content",
				type: "text",
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ""
				}
			})
		)

		return dao.saveCollection(collection)
	}
)
