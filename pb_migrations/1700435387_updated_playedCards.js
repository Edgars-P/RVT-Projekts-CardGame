/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("a3gigkdutagwaj4")

		collection.name = "spelesGajieni"

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("a3gigkdutagwaj4")

		collection.name = "playedCards"

		return dao.saveCollection(collection)
	}
)
