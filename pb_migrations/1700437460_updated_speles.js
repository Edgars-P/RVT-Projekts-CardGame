/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: "uj7pra91",
				name: "jautajumaKarts",
				type: "relation",
				required: false,
				presentable: false,
				unique: false,
				options: {
					collectionId: "hb4j45w5czyx02n",
					cascadeDelete: false,
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
		const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

		// remove
		collection.schema.removeField("uj7pra91")

		return dao.saveCollection(collection)
	}
)
