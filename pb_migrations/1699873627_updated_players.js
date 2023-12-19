/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "zjgrq5y4",
				name: "game",
				type: "relation",
				required: false,
				presentable: false,
				unique: false,
				options: {
					collectionId: "wtglq2y9rjye0wz",
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
		const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "zjgrq5y4",
				name: "game",
				type: "relation",
				required: false,
				presentable: false,
				unique: false,
				options: {
					collectionId: "wtglq2y9rjye0wz",
					cascadeDelete: false,
					minSelect: null,
					maxSelect: 1,
					displayFields: null
				}
			})
		)

		return dao.saveCollection(collection)
	}
)
