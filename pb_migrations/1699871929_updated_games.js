/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "6bvlvcif",
				name: "cardSets",
				type: "relation",
				required: false,
				presentable: false,
				unique: false,
				options: {
					collectionId: "jujjbq0fubmtwqr",
					cascadeDelete: false,
					minSelect: null,
					maxSelect: null,
					displayFields: null
				}
			})
		)

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

		// remove
		collection.schema.removeField("6bvlvcif")

		return dao.saveCollection(collection)
	}
)
