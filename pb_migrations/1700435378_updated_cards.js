/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

		collection.name = "spelesKartis"

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

		collection.name = "cards"

		return dao.saveCollection(collection)
	}
)
