/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "jaacrbik",
				name: "karsuKomplekts",
				type: "relation",
				required: false,
				presentable: false,
				unique: false,
				options: {
					collectionId: "jujjbq0fubmtwqr",
					cascadeDelete: true,
					minSelect: null,
					maxSelect: 1,
					displayFields: null
				}
			})
		)

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "jaacrbik",
				name: "cardSet",
				type: "relation",
				required: false,
				presentable: false,
				unique: false,
				options: {
					collectionId: "jujjbq0fubmtwqr",
					cascadeDelete: true,
					minSelect: null,
					maxSelect: 1,
					displayFields: null
				}
			})
		)

		return dao.saveCollection(collection)
	}
)
